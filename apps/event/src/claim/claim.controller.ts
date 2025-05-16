import { Controller, Post, Param, UseGuards, Req } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { RolesGuard } from "libs/auth/src/roles.guard";
import { JwtAuthGuard } from "apps/auth/src/auth/jwt-auth.guard";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { Roles } from "libs/auth/src/roles.decorator";

@Controller("rewards")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post(":id/claim")
  @Roles(UserRole.USER, UserRole.ADMIN)
  async claim(@Param("id") rewardId: string, @Req() req: any) {
    const userId = req.user.userId;
    const claim = await this.claimService.claimReward(userId, rewardId);

    return {
      message: "보상 요청이 성공했습니다.",
      claim,
    };
  }
}
