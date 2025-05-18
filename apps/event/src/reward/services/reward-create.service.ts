import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Reward, RewardDocument } from "../schema/reward.schema";
import { EventDocument } from "../../event/schemas/event.schema";
import { CreateRewardDto } from "libs/dto/create-reward.dto";

@Injectable()
export class RewardCreateService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel("Event") private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateRewardDto): Promise<Reward> {
    const { eventId, isLimited, quantity } = dto;

    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException("유효하지 않은 이벤트 ID입니다.");
    }

    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException("해당 이벤트를 찾을 수 없습니다.");
    }

    if (isLimited && quantity <= 0) {
      throw new BadRequestException("제한된 보상은 수량이 1 이상이어야 합니다.");
    }

    try {
      const created = new this.rewardModel(dto);
      return await created.save();
    } catch (error) {
      console.error("보상 생성 중 오류:", error);
      throw new InternalServerErrorException("보상 등록 중 오류가 발생했습니다.");
    }
  }
}
