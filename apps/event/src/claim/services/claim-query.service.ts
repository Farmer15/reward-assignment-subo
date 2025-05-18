import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Claim, ClaimDocument } from "../schema/claim.schema";
import { Reward, RewardDocument } from "../../reward/schema/reward.schema";
import { Model, Types } from "mongoose";
import { FilterClaimDto } from "libs/dto/filter-claim.dto";

@Injectable()
export class ClaimQueryService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async findClaimsByUser(userId: string): Promise<Claim[]> {
    const claims = await this.claimModel.find({ userId }).populate("rewardId").exec();
    if (!claims.length) throw new NotFoundException("보상 이력이 존재하지 않습니다.");
    return claims;
  }

  async findAllClaims(): Promise<Claim[]> {
    const claims = await this.claimModel.find().populate("rewardId").exec();
    if (!claims.length) throw new NotFoundException("등록된 보상 이력이 없습니다.");
    return claims;
  }

  async findFilteredClaims(filters: FilterClaimDto): Promise<Claim[]> {
    const query: Record<string, unknown> = {};
    if (filters.status) query["status"] = filters.status;

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
    if (!claims.length) throw new NotFoundException("조건에 맞는 보상 이력이 없습니다.");
    return claims;
  }
}
