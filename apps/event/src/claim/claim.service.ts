import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Connection, Types } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Claim, ClaimDocument } from "./schema/claim.schema";
import { Reward, RewardDocument } from "../reward/schema/reward.schema";
import { EventDocument } from "../event/schemas/event.schema";

@Injectable()
export class ClaimService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async claimReward(userId: string, rewardId: string): Promise<Claim> {
    const session = await this.connection.startSession();

    try {
      let claim: Claim;

      await session.withTransaction(async () => {
        const reward = await this.rewardModel.findById(rewardId).session(session);
        if (!reward) {
          claim = (
            await this.claimModel.create(
              [{ userId, rewardId, status: "failed", reason: "보상을 찾을 수 없습니다." }],
              { session },
            )
          )[0];

          throw new NotFoundException("보상을 찾을 수 없습니다.");
        }

        const event = await this.eventModel.findById(reward.eventId).session(session);
        if (!event) {
          claim = (
            await this.claimModel.create(
              [
                {
                  userId,
                  rewardId,
                  status: "failed",
                  reason: "보상과 연결된 이벤트를 찾을 수 없습니다.",
                },
              ],
              { session },
            )
          )[0];

          throw new NotFoundException("보상과 연결된 이벤트를 찾을 수 없습니다.");
        }

        if (event.status !== "active") {
          claim = (
            await this.claimModel.create(
              [{ userId, rewardId, status: "failed", reason: "현재 비활성화된 이벤트입니다." }],
              { session },
            )
          )[0];

          throw new BadRequestException("현재 비활성화된 이벤트입니다.");
        }

        const now = new Date();
        if (now < event.startDate || now > event.endDate) {
          claim = (
            await this.claimModel.create(
              [{ userId, rewardId, status: "failed", reason: "이벤트 기간이 아닙니다." }],
              { session },
            )
          )[0];

          throw new BadRequestException("이벤트 기간이 아닙니다.");
        }

        const exists = await this.claimModel
          .exists({ userId: new Types.ObjectId(userId), rewardId: reward._id })
          .session(session);
        if (exists) {
          claim = (
            await this.claimModel.create(
              [{ userId, rewardId, status: "failed", reason: "이미 해당 보상을 신청하셨습니다." }],
              { session },
            )
          )[0];

          throw new ConflictException("이미 해당 보상을 신청하셨습니다.");
        }

        if (reward.isLimited && reward.quantity <= 0) {
          claim = (
            await this.claimModel.create(
              [{ userId, rewardId, status: "failed", reason: "보상이 모두 소진되었습니다." }],
              { session },
            )
          )[0];

          throw new BadRequestException("보상이 모두 소진되었습니다.");
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
    } finally {
      await session.endSession();
    }
  }

  async findClaimsByUser(userId: string): Promise<Claim[]> {
    const claims = await this.claimModel.find({ userId }).populate("rewardId").exec();

    if (!claims.length) {
      throw new NotFoundException("보상 이력이 존재하지 않습니다.");
    }

    return claims;
  }

  async findAllClaims(): Promise<Claim[]> {
    const claims = await this.claimModel.find().populate("rewardId").exec();

    if (!claims.length) {
      throw new NotFoundException("등록된 보상 이력이 없습니다.");
    }

    return claims;
  }

  async findFilteredClaims(filters: {
    eventId?: string;
    userId?: string;
    status?: "success" | "failed";
  }): Promise<Claim[]> {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query["status"] = filters.status;
    }

    if (filters.eventId) {
      const rewardIds = await this.rewardModel.find({ eventId: filters.eventId }).distinct("_id");
      query["rewardId"] = { $in: rewardIds };
    }

    if (filters.userId) {
      query["userId"] = filters.userId;
    }

    return this.claimModel.find(query).populate("rewardId").exec();
  }
}
