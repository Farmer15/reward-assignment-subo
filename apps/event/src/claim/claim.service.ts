import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Connection, Model, Types } from "mongoose";
import { Claim, ClaimDocument } from "./schema/claim.schema";
import { Reward, RewardDocument } from "../reward/schema/reward.schema";
import { Event, EventDocument } from "../event/schemas/event.schema";
import { EventCondition } from "../event/types/event-condition.enum";

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
          claim = await this.saveFailedClaim(userId, rewardId, "보상을 찾을 수 없습니다.", session);
          throw new NotFoundException("보상을 찾을 수 없습니다.");
        }

        const event = await this.eventModel.findById(reward.eventId).session(session);
        if (!event) {
          claim = await this.saveFailedClaim(
            userId,
            rewardId,
            "보상과 연결된 이벤트를 찾을 수 없습니다.",
            session,
          );
          throw new NotFoundException("보상과 연결된 이벤트를 찾을 수 없습니다.");
        }

        if (event.status !== "active") {
          claim = await this.saveFailedClaim(
            userId,
            rewardId,
            "현재 비활성화된 이벤트입니다.",
            session,
          );
          throw new BadRequestException("현재 비활성화된 이벤트입니다.");
        }

        const now = new Date();
        if (now < event.startDate || now > event.endDate) {
          claim = await this.saveFailedClaim(userId, rewardId, "이벤트 기간이 아닙니다.", session);
          throw new BadRequestException("이벤트 기간이 아닙니다.");
        }

        const meetsCondition = await this.checkEventCondition(userId, event.condition);

        if (!meetsCondition) {
          claim = await this.saveFailedClaim(
            userId,
            rewardId,
            `이벤트 조건을 만족하지 못했습니다. (조건: ${event.condition})`,
            session,
          );

          throw new BadRequestException("이벤트 조건을 만족하지 못했습니다.");
        }

        const exists = await this.claimModel
          .exists({ userId: new Types.ObjectId(userId), rewardId: reward._id })
          .session(session);
        if (exists) {
          claim = await this.saveFailedClaim(
            userId,
            rewardId,
            "이미 해당 보상을 신청하셨습니다.",
            session,
          );
          throw new ConflictException("이미 해당 보상을 신청하셨습니다.");
        }

        if (reward.isLimited && reward.quantity <= 0) {
          claim = await this.saveFailedClaim(
            userId,
            rewardId,
            "보상이 모두 소진되었습니다.",
            session,
          );
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
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error("보상 요청 처리 중 알 수 없는 오류:", error);
      throw new InternalServerErrorException("보상 요청 처리 중 오류가 발생했습니다.");
    } finally {
      await session.endSession();
    }
  }

  private async saveFailedClaim(
    userId: string,
    rewardId: string,
    reason: string,
    session: any,
  ): Promise<Claim> {
    try {
      return (
        await this.claimModel.create([{ userId, rewardId, status: "failed", reason }], { session })
      )[0];
    } catch (error) {
      console.error("실패 보상 이력 저장 중 오류:", error);
      throw new InternalServerErrorException("보상 이력 저장 중 오류가 발생했습니다.");
    }
  }

  private async checkEventCondition(userId: string, condition: string): Promise<boolean> {
    switch (condition) {
      case EventCondition.DAILY_LOGIN_7_DAYS:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.REFER_3_FRIENDS:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.COMPLETE_PROFILE:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.WRITE_REVIEW:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.SUBMIT_FEEDBACK:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.COMPLETE_TUTORIAL:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.BIRTHDAY_LOGIN:
        // 조건 검증 로직 연결

        return true;
      case EventCondition.ANNIVERSARY_LOGIN:
        // 조건 검증 로직 연결

        return true;
      default:
        return false;
    }
  }

  async findClaimsByUser(userId: string): Promise<Claim[]> {
    try {
      const claims = await this.claimModel.find({ userId }).populate("rewardId").exec();
      if (!claims.length) {
        throw new NotFoundException("보상 이력이 존재하지 않습니다.");
      }
      return claims;
    } catch (error) {
      console.error("사용자 보상 이력 조회 오류:", error);
      throw new InternalServerErrorException("보상 이력 조회 중 오류가 발생했습니다.");
    }
  }

  async findAllClaims(): Promise<Claim[]> {
    try {
      const claims = await this.claimModel.find().populate("rewardId").exec();
      if (!claims.length) {
        throw new NotFoundException("등록된 보상 이력이 없습니다.");
      }
      return claims;
    } catch (error) {
      console.error("전체 보상 이력 조회 오류:", error);
      throw new InternalServerErrorException("전체 이력 조회 중 오류가 발생했습니다.");
    }
  }

  async findFilteredClaims(filters: {
    eventId?: string;
    userId?: string;
    status?: "success" | "failed";
  }): Promise<Claim[]> {
    try {
      const query: Record<string, unknown> = {};

      if (filters.status) {
        query["status"] = filters.status;
      }

      if (filters.eventId) {
        if (!Types.ObjectId.isValid(filters.eventId)) {
          throw new BadRequestException("유효하지 않은 이벤트 ID입니다.");
        }

        const rewardIds = await this.rewardModel.find({ eventId: filters.eventId }).distinct("_id");
        query["rewardId"] = { $in: rewardIds };
      }

      if (filters.userId) {
        if (!Types.ObjectId.isValid(filters.userId)) {
          throw new BadRequestException("유효하지 않은 유저 ID입니다.");
        }
        query["userId"] = filters.userId;
      }

      const claims = await this.claimModel.find(query).populate("rewardId").exec();

      if (!claims.length) {
        throw new NotFoundException("조건에 맞는 보상 이력이 없습니다.");
      }

      return claims;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error("보상 이력 필터링 조회 오류:", error);
      throw new InternalServerErrorException("보상 이력 필터링 중 오류가 발생했습니다.");
    }
  }
}
