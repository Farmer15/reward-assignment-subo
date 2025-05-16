import { Controller, Post, Param, UseGuards } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { RolesGuard } from "libs/auth/src/guards/roles.guard";
import { JwtAuthGuard } from "apps/auth/src/auth/jwt-auth.guard";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { Roles } from "libs/auth/src/decorators/roles.decorator";
import { CurrentUser } from "libs/auth/src/decorators/current-user.decorator";
import { AuthUser } from "apps/auth/src/types/auth-user.interface";

@Controller("rewards")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post(":id/claim")
  @Roles(UserRole.USER, UserRole.ADMIN)
  async claim(@Param("id") rewardId: string, @CurrentUser() user: AuthUser) {
    const claim = await this.claimService.claimReward(user.userId, rewardId);

    return {
      message: "보상 요청이 성공했습니다.",
      claim,
    };
  }
}
