import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { Reward, RewardDocument } from "./schema/reward.schema";
import { EventDocument } from "../event/schemas/event.schema";

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateRewardDto): Promise<Reward> {
    const { eventId } = dto;

    if (!Types.ObjectId.isValid(eventId)) {
      throw new NotFoundException("유효하지 않은 이벤트 ID입니다.");
    }

    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException("해당 이벤트를 찾을 수 없습니다.");
    }

    const created = new this.rewardModel(dto);
    return created.save();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new NotFoundException("유효하지 않은 이벤트 ID입니다.");
    }

    return this.rewardModel.find({ eventId }).exec();
  }
}
