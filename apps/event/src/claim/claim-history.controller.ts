import { Controller, Get, Param, Query } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { CurrentUser } from "libs/auth/src/decorators/current-user.decorator";
import { AuthUser } from "apps/auth/src/types/auth-user.interface";
import { FilterClaimDto } from "./dto/filter-claim.dto";

@Controller("claims")
export class ClaimHistoryController {
  constructor(private readonly claimService: ClaimService) {}

  @Get("me")
  async getMyClaims(@CurrentUser() user: AuthUser) {
    const claims = await this.claimService.findClaimsByUser(user.userId);
    return {
      message: "보상 이력 조회에 성공하셨습니다.",
      claims,
    };
  }

  @Get()
  async getAllClaims() {
    const claims = await this.claimService.findAllClaims();
    return {
      message: "전체 보상 이력 조회에 성공했습니다.",
      claims,
    };
  }

  @Get("user/:userId")
  async getClaimsByUser(@Param("userId") userId: string) {
    const claims = await this.claimService.findClaimsByUser(userId);
    return {
      message: `유저(${userId}) 보상 이력 조회에 성공했습니다.`,
      claims,
    };
  }

  @Get("filter")
  async filterClaims(@Query() query: FilterClaimDto) {
    const claims = await this.claimService.findFilteredClaims(query);

    return {
      message: "필터링된 보상 이력 조회에 성공했습니다.",
      claims,
    };
  }
}
