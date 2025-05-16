import { Controller, Post, Param, UseGuards, Req } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { JwtAuthGuard } from "apps/auth/src/auth/jwt-auth.guard";

@Controller("rewards")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":id/claim")
  async claim(@Param("id") rewardId: string, @Req() req: any) {
    const userId = req.user.userId;
    const claim = await this.claimService.claimReward(userId, rewardId);

    return {
      message: "보상 요청이 성공했습니다.",
      claim,
    };
  }
}
