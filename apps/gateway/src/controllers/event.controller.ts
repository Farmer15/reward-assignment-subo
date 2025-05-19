import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateEventDto } from "libs/dto/create-event.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "libs/decorators/roles.decorator";
import { EventProxyService } from "../proxy/event.proxy.service";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { AuthUser } from "libs/types/auth-user.interface";
import { UserRole } from "libs/types/user-role";

@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventProxyService: EventProxyService) {}

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async createEvent(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) {
    return await this.eventProxyService.createEvent(dto, user);
  }
}
