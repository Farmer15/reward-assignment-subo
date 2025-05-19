import { Controller, Get, Param, Query } from "@nestjs/common";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { ClaimQueryService } from "../services/claim-query.service";
import { FilterClaimDto } from "libs/dto/filter-claim.dto";
import { AuthUser } from "libs/types/auth-user.interface";

@Controller("claims")
export class ClaimHistoryController {
  constructor(private readonly claimQueryService: ClaimQueryService) {}

  @Get("me")
  async getMyClaims(@CurrentUser() user: AuthUser) {
    const claims = await this.claimQueryService.findClaimsByUser(user.userId);

    return {
      message: "보상 이력 조회에 성공하셨습니다.",
      claims,
    };
  }

  @Get()
  async getAllClaims() {
    const claims = await this.claimQueryService.findAllClaims();

    return {
      message: "전체 보상 이력 조회에 성공했습니다.",
      claims,
    };
  }

  @Get("user/:userId")
  async getClaimsByUser(@Param("userId") userId: string) {
    const claims = await this.claimQueryService.findClaimsByUser(userId);

    return {
      message: `유저(${userId}) 보상 이력 조회에 성공했습니다.`,
      claims,
    };
  }

  @Get("filter")
  async filterClaims(@Query() query: FilterClaimDto) {
    const claims = await this.claimQueryService.findFilteredClaims(query);

    return {
      message: "필터링된 보상 이력 조회에 성공했습니다.",
      claims,
    };
  }
}
