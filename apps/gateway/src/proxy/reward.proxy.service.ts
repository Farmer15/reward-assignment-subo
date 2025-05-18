import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateRewardDto } from "apps/event/src/reward/dto/create-reward.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class RewardProxyService {
  constructor(private readonly httpService: HttpService) {}

  async create(dto: CreateRewardDto) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.EVENT_SERVICE_URL}/rewards`, dto),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, "보상 등록 중 오류가 발생했습니다.");
    }
  }

  async findAll() {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/rewards`),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, "보상 목록 조회 중 오류가 발생했습니다.");
    }
  }

  async findByEvent(eventId: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/rewards/event/${eventId}`),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, "이벤트별 보상 조회 중 오류가 발생했습니다.");
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (typeof error === "object" && error !== null) {
      const err = error as { response?: unknown };
      const res = err.response as { data?: unknown };
      const data = res?.data as { message?: unknown };

      if (typeof data?.message === "string") {
        throw new InternalServerErrorException(data.message);
      }
    }

    throw new InternalServerErrorException(fallbackMessage);
  }
}