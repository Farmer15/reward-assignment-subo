import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "libs/dto/create-event.dto";
import { firstValueFrom } from "rxjs";
import { handleAxiosError } from "../common/utils/axios-error.util";
import { AuthUser } from "apps/auth/src/user/types/auth-user.interface";

@Injectable()
export class EventProxyService {
  constructor(private readonly httpService: HttpService) {}

  async createEvent(dto: CreateEventDto, user: AuthUser) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.EVENT_SERVICE_URL}/events`, dto, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "이벤트 생성 중 오류가 발생했습니다.");
    }
  }
}
