import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "apps/event/src/event/dto/create-event.dto";
import { firstValueFrom } from "rxjs";
import { handleAxiosError } from "../common/utils/axios-error.util";

@Injectable()
export class EventProxyService {
  constructor(private readonly httpService: HttpService) {}

  async createEvent(dto: CreateEventDto) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.EVENT_SERVICE_URL}/events`, dto),
      );
      return res.data;
    } catch (error) {
      handleAxiosError(error, "이벤트 생성 중 오류가 발생했습니다.");
    }
  }
}
