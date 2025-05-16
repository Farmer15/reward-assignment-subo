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

@Injectable()
export class ClaimService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async claimReward(userId: string, rewardId: string): Promise<Claim> {
    const session = await this.connection.startSession();

    try {
      let result: Claim;

      await session.withTransaction(async () => {
        const reward = await this.rewardModel.findById(rewardId).session(session);
        if (!reward) {
          throw new NotFoundException("보상을 찾을 수 없습니다.");
        }

        const exists = await this.claimModel
          .exists({
            userId: new Types.ObjectId(userId),
            rewardId: reward._id,
          })
          .session(session);

        if (exists) {
          throw new ConflictException("이미 이 보상을 신청했습니다.");
        }

        if (reward.isLimited) {
          if (reward.quantity <= 0) {
            throw new BadRequestException("보상이 모두 소진되었습니다.");
          }

          reward.quantity -= 1;
          await reward.save({ session });
        }

        result = await this.claimModel
          .create([{ userId, rewardId }], { session })
          .then((r) => r[0]);
      });

      return result!;
    } finally {
      await session.endSession();
    }
  }
}
