import { Controller, Get, Param } from "@nestjs/common";
import { RewardService } from "../services/reward.service";

@Controller("rewards")
export class RewardReadController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async findAll() {
    const rewards = await this.rewardService.findAll();

    return {
      message: "보상 목록 조회에 성공했습니다.",
      rewards,
    };
  }

  @Get("event/:eventId")
  async findByEvent(@Param("eventId") eventId: string) {
    const rewards = await this.rewardService.findByEvent(eventId);

    return {
      message: "이벤트별 보상 조회에 성공했습니다.",
      rewards,
    };
  }
}
