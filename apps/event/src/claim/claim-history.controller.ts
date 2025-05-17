import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "apps/auth/src/auth/jwt-auth.guard";
import { RolesGuard } from "libs/auth/src/guards/roles.guard";
import { ClaimService } from "./claim.service";
import { Roles } from "libs/auth/src/decorators/roles.decorator";
import { CurrentUser } from "libs/auth/src/decorators/current-user.decorator";
import { AuthUser } from "apps/auth/src/types/auth-user.interface";
import { UserRole } from "apps/auth/src/user/types/user-role";

@Controller("claims")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimHistoryController {
  constructor(private readonly claimService: ClaimService) {}

  @Get("me")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  async getMyClaims(@CurrentUser() user: AuthUser) {
    const claims = await this.claimService.findClaimsByUser(user.userId);
    return {
      message: "보상 이력 조회에 성공하셨습니다.",
      claims,
    };
  }

  @Get()
  @Roles(UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  async getAllClaims() {
    const claims = await this.claimService.findAllClaims();
    return {
      message: "전체 보상 이력 조회에 성공했습니다.",
      claims,
    };
  }

  @Get("user/:userId")
  @Roles(UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  async getClaimsByUser(@Param("userId") userId: string) {
    const claims = await this.claimService.findClaimsByUser(userId);
    return {
      message: `유저(${userId}) 보상 이력 조회에 성공했습니다.`,
      claims,
    };
  }

  @Get("filter")
  @Roles(UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  async getFilteredClaims(@Query("eventId") eventId?: string, @Query("userId") userId?: string) {
    const claims = await this.claimService.findFilteredClaims({ eventId, userId });

    return {
      message: "필터링된 보상 이력 조회에 성공했습니다.",
      claims,
    };
  }
}
