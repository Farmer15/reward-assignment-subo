import { Body, Controller, Post } from "@nestjs/common";
import { CreateEventDto } from "libs/dto/create-event.dto";
import { EventCreateService } from "../services/event-create.service";

@Controller("events")
export class EventCreateController {
  constructor(private readonly eventCreateService: EventCreateService) {}

  @Post()
  async create(@Body() dto: CreateEventDto) {
    const event = await this.eventCreateService.create(dto);

    return {
      message: "이벤트 등록 성공했습니다.",
      event,
    };
  }
}
