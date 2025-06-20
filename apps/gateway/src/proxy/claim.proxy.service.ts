import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { FilterClaimDto } from "libs/dto/filter-claim.dto";
import { firstValueFrom } from "rxjs";
import { handleAxiosError } from "../common/utils/axios-error.util";
import { AuthUser } from "libs/types/auth-user.interface";

@Injectable()
export class ClaimProxyService {
  constructor(private readonly httpService: HttpService) {}

  async claimReward(user: AuthUser, rewardId: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.EVENT_SERVICE_URL}/rewards/${rewardId}/claim`, {
          userId: user.userId,
        }),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "보상 요청 중 오류가 발생했습니다.");
    }
  }

  async findClaimsByUser(user: AuthUser | { userId: string }) {
    const userId = "userId" in user ? user.userId : user;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/claims/user/${userId}`),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "유저 보상 이력 조회 중 오류가 발생했습니다.");
    }
  }

  async findAllClaims() {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/claims`),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "전체 보상 이력 조회 중 오류가 발생했습니다.");
    }
  }

  async findFilteredClaims(query: FilterClaimDto) {
    try {
      const queryString = new URLSearchParams(query as Record<string, string>).toString();
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/claims/filter?${queryString}`),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "보상 이력 필터링 중 오류가 발생했습니다.");
    }
  }
}
