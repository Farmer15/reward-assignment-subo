import { Body, Controller, Post } from "@nestjs/common";
import { RewardService } from "./reward.service";
import { CreateRewardDto } from "./dto/create-reward.dto";

@Controller("rewards")
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async createReward(@Body() dto: CreateRewardDto) {
    const reward = await this.rewardService.create(dto);

    return {
      message: "보상 등록에 성공했습니다.",
      reward,
    };
  }
}
