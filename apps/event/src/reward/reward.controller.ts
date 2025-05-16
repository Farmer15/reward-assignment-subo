import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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

  @Get()
  async getAllRewards() {
    const rewards = await this.rewardService.findAll();

    return {
      message: "보상 목록 조회에 성공했습니다.",
      rewards,
    };
  }

  @Get("event/:eventId")
  async getRewardsByEvent(@Param("eventId") eventId: string) {
    const rewards = await this.rewardService.findByEvent(eventId);
    return {
      message: "이벤트별 보상 조회에 성공했습니다.",
      rewards,
    };
  }
}
