import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Claim, ClaimDocument } from "../schema/claim.schema";
import { Connection, Model, Types } from "mongoose";
import { Reward, RewardDocument } from "../../reward/schema/reward.schema";
import { EventDocument } from "../../event/schemas/event.schema";
import { checkEventCondition } from "../helpers/check-event-condition";
import { saveFailedClaim } from "../helpers/save-failed-claim";

@Injectable()
export class ClaimRewardService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async execute(userId: string, rewardId: string): Promise<Claim> {
    const session = await this.connection.startSession();
    let claim: Claim;

    try {
      await session.withTransaction(async () => {
        const reward = await this.rewardModel.findById(rewardId).session(session);
        if (!reward) {
          throw new Error("보상을 찾을 수 없습니다.");
        }

        const event = await this.eventModel.findById(reward.eventId).session(session);
        if (!event) {
          throw new Error("보상과 연결된 이벤트를 찾을 수 없습니다.");
        }

        if (event.status !== "active") {
          throw new Error("현재 비활성화된 이벤트입니다.");
        }

        const now = new Date();
        if (now < event.startDate || now > event.endDate) {
          throw new Error("이벤트 기간이 아닙니다.");
        }

        const meetsCondition = await checkEventCondition(userId, event.condition);
        if (!meetsCondition) {
          throw new Error("이벤트 조건을 만족하지 못했습니다.");
        }

        const exists = await this.claimModel
          .exists({ userId: new Types.ObjectId(userId), rewardId: reward._id })
          .session(session);
        if (exists) {
          throw new Error("이미 해당 보상을 신청하셨습니다.");
        }

        if (reward.isLimited && reward.quantity <= 0) {
          throw new Error("보상이 모두 소진되었습니다.");
        }

        if (reward.isLimited) {
          reward.quantity -= 1;
          await reward.save({ session });
        }

        claim = (
          await this.claimModel.create([{ userId, rewardId, status: "success" }], { session })
        )[0];
      });

      return claim!;
    } catch (error) {
      const message = error instanceof Error ? error.message : "알 수 없는 오류";
      await saveFailedClaim(this.claimModel, userId, rewardId, message);

      switch (message) {
        case "보상을 찾을 수 없습니다.":
        case "보상과 연결된 이벤트를 찾을 수 없습니다.":
          throw new NotFoundException(message);
        case "이미 해당 보상을 신청하셨습니다.":
          throw new ConflictException(message);
        case "현재 비활성화된 이벤트입니다.":
        case "이벤트 기간이 아닙니다.":
        case "이벤트 조건을 만족하지 못했습니다.":
        case "보상이 모두 소진되었습니다.":
          throw new BadRequestException(message);
        default:
          throw new InternalServerErrorException("보상 요청 처리 중 오류가 발생했습니다.");
      }
    } finally {
      await session.endSession();
    }
  }
}
