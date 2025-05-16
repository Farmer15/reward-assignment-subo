import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { Reward, RewardDocument } from "./schema/reward.schema";

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  async create(dto: CreateRewardDto): Promise<Reward> {
    return this.rewardModel.create(dto);
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }
}
