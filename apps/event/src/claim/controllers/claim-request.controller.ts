import { Controller, Post, Param, Body } from "@nestjs/common";
import { ClaimRewardService } from "../services/claim-reward.service";

@Controller("rewards")
export class ClaimRequestController {
  constructor(private readonly claimRewardService: ClaimRewardService) {}

  @Post(":id/claim")
  async claim(@Param("id") rewardId: string, @Body("userId") userId: string) {
    const claim = await this.claimRewardService.execute(userId, rewardId);

    return {
      message: "보상 요청이 성공했습니다.",
      claim,
    };
  }
}
