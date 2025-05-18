import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RewardService } from "./reward.service";
import { CreateRewardDto } from "./dto/create-reward.dto";
import { JwtAuthGuard } from "apps/gateway/src/auth/jwt-auth.guard";
import { RolesGuard } from "apps/gateway/src/auth/roles.guard";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { Roles } from "libs/auth/src/decorators/roles.decorator";

@Controller("rewards")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createReward(@Body() dto: CreateRewardDto) {
    const reward = await this.rewardService.create(dto);

    return {
      message: "보상 등록에 성공했습니다.",
      reward,
    };
  }

  @Get()
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async getAllRewards() {
    const rewards = await this.rewardService.findAll();

    return {
      message: "보상 목록 조회에 성공했습니다.",
      rewards,
    };
  }

  @Get("event/:eventId")
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async getRewardsByEvent(@Param("eventId") eventId: string) {
    const rewards = await this.rewardService.findByEvent(eventId);
    return {
      message: "이벤트별 보상 조회에 성공했습니다.",
      rewards,
    };
  }
}
