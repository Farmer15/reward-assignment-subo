import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { RolesGuard } from "libs/auth/src/guards/roles.guard";
import { JwtAuthGuard } from "apps/auth/src/auth/jwt-auth.guard";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { Roles } from "libs/auth/src/decorators/roles.decorator";

@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createEvent(@Body() dto: CreateEventDto) {
    const event = await this.eventService.create(dto);

    return {
      message: "이벤트 등록 성공했습니다.",
      event,
    };
  }
}
