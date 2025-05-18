import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "libs/decorators/roles.decorator";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { CreateRewardDto } from "libs/dto/create-reward.dto";
import { RewardProxyService } from "../proxy/reward.proxy.service";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { AuthUser } from "apps/auth/src/user/types/auth-user.interface";

@Controller("rewards")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardController {
  constructor(private readonly rewardProxyService: RewardProxyService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createReward(@Body() dto: CreateRewardDto, @CurrentUser() user: AuthUser) {
    const reward = await this.rewardProxyService.create(dto, user);

    return {
      message: "보상 등록에 성공했습니다.",
      reward,
    };
  }

  @Get()
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async getAllRewards(@CurrentUser() user: AuthUser) {
    const rewards = await this.rewardProxyService.findAll(user);

    return {
      message: "보상 목록 조회에 성공했습니다.",
      rewards,
    };
  }

  @Get("event/:eventId")
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async getRewardsByEvent(@Param("eventId") eventId: string, @CurrentUser() user: AuthUser) {
    const rewards = await this.rewardProxyService.findByEvent(eventId, user);

    return {
      message: "이벤트별 보상 조회에 성공했습니다.",
      rewards,
    };
  }
}
