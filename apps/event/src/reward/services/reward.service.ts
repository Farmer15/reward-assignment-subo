import { Injectable } from "@nestjs/common";
import { CreateRewardDto } from "../../../../../libs/dto/create-reward.dto";
import { Reward } from "../schema/reward.schema";
import { RewardCreateService } from "./reward-create.service";
import { RewardFetchService } from "./reward-fetch.service";

@Injectable()
export class RewardService {
  constructor(
    private readonly rewardCreateService: RewardCreateService,
    private readonly rewardFetchService: RewardFetchService,
  ) {}

  async create(dto: CreateRewardDto): Promise<Reward> {
    return await this.rewardCreateService.create(dto);
  }

  async findAll(): Promise<Reward[]> {
    return await this.rewardFetchService.findAll();
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    return await this.rewardFetchService.findByEvent(eventId);
  }
}
