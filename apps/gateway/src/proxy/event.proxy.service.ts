import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateEventDto } from "apps/event/src/event/dto/create-event.dto";
import { firstValueFrom } from "rxjs";

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
      const message = this.extractErrorMessage(error);

      throw new InternalServerErrorException(message || "이벤트 생성 중 오류가 발생했습니다.");
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error !== "object" || error === null) {
      return "알 수 없는 오류가 발생했습니다.";
    }

    const res = (error as { response: unknown }).response;

    if (typeof res !== "object" || res === null) {
      return "알 수 없는 오류가 발생했습니다.";
    }

    const data = (res as { data: unknown }).data;

    if (typeof data !== "object" || data === null) {
      return "알 수 없는 오류가 발생했습니다.";
    }

    const msg = (data as { message: unknown }).message;

    return typeof msg === "string" ? msg : "알 수 없는 오류가 발생했습니다.";
  }
}
