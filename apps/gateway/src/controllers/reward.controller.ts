import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "libs/auth/src/decorators/roles.decorator";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { CreateRewardDto } from "apps/event/src/reward/dto/create-reward.dto";
import { RewardProxyService } from "../proxy/reward.proxy.service";

@Controller("rewards")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardController {
  constructor(private readonly rewardProxyService: RewardProxyService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createReward(@Body() dto: CreateRewardDto) {
    const reward = await this.rewardProxyService.create(dto);
    return {
      message: "보상 등록에 성공했습니다.",
      reward,
    };
  }

  @Get()
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async getAllRewards() {
    const rewards = await this.rewardProxyService.findAll();
    return {
      message: "보상 목록 조회에 성공했습니다.",
      rewards,
    };
  }

  @Get("event/:eventId")
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async getRewardsByEvent(@Param("eventId") eventId: string) {
    const rewards = await this.rewardProxyService.findByEvent(eventId);
    return {
      message: "이벤트별 보상 조회에 성공했습니다.",
      rewards,
    };
  }
}
