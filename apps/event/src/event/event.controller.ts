import { Body, Controller, Post } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    const event = await this.eventService.create(dto);

    return {
      message: "이벤트 등록 성공",
      event,
    };
  }
}
