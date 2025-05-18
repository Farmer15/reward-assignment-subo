import { Controller, Post, Param } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { CurrentUser } from "libs/auth/src/decorators/current-user.decorator";
import { AuthUser } from "apps/auth/src/types/auth-user.interface";

@Controller("rewards")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post(":id/claim")
  async claim(@Param("id") rewardId: string, @CurrentUser() user: AuthUser) {
    const claim = await this.claimService.claimReward(user.userId, rewardId);

    return {
      message: "보상 요청이 성공했습니다.",
      claim,
    };
  }
}
