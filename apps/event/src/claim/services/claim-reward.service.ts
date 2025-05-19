import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Claim, ClaimDocument } from "../schema/claim.schema";
import { ClientSession, Connection, Model, Types } from "mongoose";
import { Reward, RewardDocument } from "../../reward/schema/reward.schema";
import { Event, EventDocument } from "../../event/schemas/event.schema";
import { saveFailedClaim } from "../helpers/save-failed-claim";
import { EventConditionCheckerService } from "./event-condition-checker.service";

@Injectable()
export class ClaimRewardService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventConditionChecker: EventConditionCheckerService,
  ) {}

  async execute(userId: string, rewardId: string): Promise<Claim> {
    const session = await this.connection.startSession();
    let claim: Claim;

    try {
      await session.withTransaction(async () => {
        const reward = await this.getValidReward(rewardId, session);
        const event = await this.getValidEvent(reward.eventId, session);

        this.validateEventPeriod(event);
        await this.ensureConditionMet(userId, event.condition);
        await this.ensureNotAlreadyClaimed(userId, event.id, session);

        if (reward.isLimited) {
          await this.decrementRewardQuantityIfAvailable(reward.id, session);
        }

        claim = await this.createClaim(userId, rewardId, event.id, session);
      });

      return claim!;
    } catch (error) {
      let message = "알 수 없는 오류";

      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        message = "이미 해당 이벤트에 대한 보상을 수령하셨습니다.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      await saveFailedClaim(this.claimModel, userId, rewardId, message);
      this.rethrowFormattedError(message);
    } finally {
      await session.endSession();
    }
  }

  private async getValidReward(rewardId: string, session: ClientSession) {
    const reward = await this.rewardModel.findById(rewardId).session(session);

    if (!reward) {
      throw new Error("보상을 찾을 수 없습니다.");
    }
    return reward;
  }

  private async getValidEvent(eventId: Types.ObjectId, session: ClientSession) {
    const event = await this.eventModel.findById(eventId).session(session);

    if (!event) {
      throw new Error("보상과 연결된 이벤트를 찾을 수 없습니다.");
    }

    if (event.status !== "active") {
      throw new Error("현재 비활성화된 이벤트입니다.");
    }

    return event;
  }

  private validateEventPeriod(event: EventDocument) {
    const now = new Date();

    if (now < event.startDate || now > event.endDate) {
      throw new Error("이벤트 기간이 아닙니다.");
    }
  }

  private async ensureConditionMet(userId: string, condition: EventDocument["condition"]) {
    const ok = await this.eventConditionChecker.check(userId, condition);

    if (!ok) {
      throw new Error("이벤트 조건을 만족하지 못했습니다.");
    }
  }

  private async ensureNotAlreadyClaimed(
    userId: string,
    eventId: Types.ObjectId,
    session: ClientSession,
  ) {
    const exists = await this.claimModel
      .exists({ userId: new Types.ObjectId(userId), eventId })
      .session(session);

    if (exists) {
      throw new Error("이미 해당 이벤트에 대한 보상을 수령하셨습니다.");
    }
  }

  private async decrementRewardQuantityIfAvailable(
    rewardId: Types.ObjectId,
    session: ClientSession,
  ): Promise<void> {
    const result = await this.rewardModel.updateOne(
      { _id: rewardId, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { session },
    );

    if (result.modifiedCount === 0) {
      throw new Error("보상이 모두 소진되었습니다.");
    }
  }

  private async createClaim(
    userId: string,
    rewardId: string,
    eventId: Types.ObjectId,
    session: ClientSession,
  ) {
    return (
      await this.claimModel.create([{ userId, rewardId, eventId, status: "success" }], { session })
    )[0];
  }

  private rethrowFormattedError(message: string): never {
    switch (message) {
      case "보상을 찾을 수 없습니다.":
      case "보상과 연결된 이벤트를 찾을 수 없습니다.":
        throw new NotFoundException(message);
      case "이미 해당 이벤트에 대한 보상을 수령하셨습니다.":
        throw new ConflictException(message);
      case "현재 비활성화된 이벤트입니다.":
      case "이벤트 기간이 아닙니다.":
      case "이벤트 조건을 만족하지 못했습니다.":
      case "보상이 모두 소진되었습니다.":
        throw new BadRequestException(message);
      default:
        throw new InternalServerErrorException("보상 요청 처리 중 오류가 발생했습니다.");
    }
  }
}
