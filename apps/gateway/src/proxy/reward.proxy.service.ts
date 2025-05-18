import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CreateRewardDto } from "apps/event/src/reward/dto/create-reward.dto";
import { firstValueFrom } from "rxjs";
import { handleAxiosError } from "../common/utils/axios-error.util";

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
      handleAxiosError(error, "보상 등록 중 오류가 발생했습니다.");
    }
  }

  async findAll() {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/rewards`),
      );
      return res.data;
    } catch (error) {
      handleAxiosError(error, "보상 목록 조회 중 오류가 발생했습니다.");
    }
  }

  async findByEvent(eventId: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.EVENT_SERVICE_URL}/rewards/event/${eventId}`),
      );
      return res.data;
    } catch (error) {
      handleAxiosError(error, "이벤트별 보상 조회 중 오류가 발생했습니다.");
    }
  }
}
