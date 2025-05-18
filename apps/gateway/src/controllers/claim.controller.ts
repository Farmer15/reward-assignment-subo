import { Controller, Post, Param, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { AuthUser } from "apps/auth/src/user/types/auth-user.interface";
import { FilterClaimDto } from "libs/dto/filter-claim.dto";
import { ClaimProxyService } from "../proxy/claim.proxy.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "libs/decorators/roles.decorator";
import { UserRole } from "apps/auth/src/user/types/user-role";

@Controller("claims")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimController {
  constructor(private readonly claimProxyService: ClaimProxyService) {}

  @Post(":rewardId/claim")
  @Roles(UserRole.USER, UserRole.ADMIN)
  async claim(@Param("rewardId") rewardId: string, @CurrentUser() user: AuthUser) {
    const claim = await this.claimProxyService.claimReward(user, rewardId);

    return { message: "보상 요청이 성공했습니다.", claim };
  }

  @Get("me")
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  async getMyClaims(@CurrentUser() user: AuthUser) {
    const claims = await this.claimProxyService.findClaimsByUser(user);

    return { message: "보상 이력 조회에 성공했습니다.", claims };
  }

  @Get()
  @Roles(UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  async getAllClaims() {
    const claims = await this.claimProxyService.findAllClaims();

    return { message: "전체 보상 이력 조회에 성공했습니다.", claims };
  }

  @Get("user/:userId")
  @Roles(UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN)
  async getClaimsByUser(@Param("userId") userId: string) {
    const claims = await this.claimProxyService.findClaimsByUser({ userId });

    return { message: `유저(${userId})의 보상 이력 조회에 성공했습니다.`, claims };
  }

  @Get("filter")
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  async filterClaims(@Query() query: FilterClaimDto) {
    const claims = await this.claimProxyService.findFilteredClaims(query);

    return { message: "필터링된 보상 이력 조회에 성공했습니다.", claims };
  }
}
