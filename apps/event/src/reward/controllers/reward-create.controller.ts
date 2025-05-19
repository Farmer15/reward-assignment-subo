import { Body, Controller, Post } from "@nestjs/common";
import { Roles } from "libs/decorators/roles.decorator";
import { CreateRewardDto } from "libs/dto/create-reward.dto";
import { RewardService } from "../services/reward.service";
import { UserRole } from "libs/types/user-role";

@Controller("rewards")
export class RewardCreateController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async create(@Body() dto: CreateRewardDto) {
    const reward = await this.rewardService.create(dto);

    return {
      message: "보상 등록에 성공했습니다.",
      reward,
    };
  }
}
