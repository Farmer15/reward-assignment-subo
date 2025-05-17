import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
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

  async findAll(): Promise<Reward[]> {
    try {
      const rewards = await this.rewardModel.find().lean().exec();

      if (!rewards.length) {
        throw new NotFoundException("등록된 보상이 없습니다.");
      }

      return rewards;
    } catch (error) {
      console.error("보상 전체 조회 중 오류:", error);
      throw new InternalServerErrorException("보상 목록 조회 중 오류가 발생했습니다.");
    }
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException("유효하지 않은 이벤트 ID입니다.");
    }

    try {
      const event = await this.eventModel.findById(eventId).lean();
      if (!event) {
        throw new NotFoundException("해당 이벤트가 존재하지 않습니다.");
      }

      const rewards = await this.rewardModel.find({ eventId }).lean().exec();

      if (!rewards.length) {
        throw new NotFoundException("해당 이벤트에 등록된 보상이 없습니다.");
      }

      return rewards;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      console.error("이벤트별 보상 조회 중 오류:", error);
      throw new InternalServerErrorException("이벤트별 보상 조회 중 오류가 발생했습니다.");
    }
  }
}
