import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FilterClaimDto } from "apps/event/src/claim/dto/filter-claim.dto";
import { firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class ClaimProxyService {
  constructor(private readonly httpService: HttpService) {}

  async claimReward(userId: string, rewardId: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.EVENT_SERVICE_URL}/rewards/${rewardId}/claim`, {
          userId,
        }),
      );

      return res.data;
    } catch (error) {
      const message = this.extractErrorMessage(error);

      throw new InternalServerErrorException(message || "보상 요청 중 오류가 발생했습니다.");
    }
  }

  async findClaimsByUser(userId: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/claims/user/${userId}`),
      );

      return res.data;
    } catch (error) {
      const message = this.extractErrorMessage(error);

      throw new InternalServerErrorException(
        message || "유저 보상 이력 조회 중 오류가 발생했습니다.",
      );
    }
  }

  async findAllClaims() {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/claims`),
      );

      return res.data;
    } catch (error) {
      const message = this.extractErrorMessage(error);

      throw new InternalServerErrorException(
        message || "전체 보상 이력 조회 중 오류가 발생했습니다.",
      );
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
      const message = this.extractErrorMessage(error);

      throw new InternalServerErrorException(message || "보상 이력 필터링 중 오류가 발생했습니다.");
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error !== "object" || error === null) {
      return "알 수 없는 오류가 발생했습니다.";
    }

    const err = error as { response: unknown };
    const response = err.response;

    if (typeof response !== "object" || response === null) {
      return "알 수 없는 오류가 발생했습니다.";
    }

    const res = response as { data: unknown };
    const data = res.data;

    if (typeof data !== "object" || data === null) {
      return "알 수 없는 오류가 발생했습니다.";
    }

    const messageObj = data as { message: unknown };
    const message = messageObj.message;

    if (typeof message === "string") {
      return message;
    }

    return "알 수 없는 오류가 발생했습니다.";
  }
}
