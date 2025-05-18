import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateEventDto } from "apps/event/src/event/dto/create-event.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "libs/auth/src/decorators/roles.decorator";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { EventProxyService } from "../proxy/event.proxy.service";

@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventProxyService: EventProxyService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createEvent(@Body() dto: CreateEventDto) {
    return await this.eventProxyService.createEvent(dto);
  }
}
