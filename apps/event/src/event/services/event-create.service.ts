import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event, EventDocument } from "../schemas/event.schema";
import { CreateEventDto } from "libs/dto/create-event.dto";

@Injectable()
export class EventCreateService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const { name, startDate, endDate } = dto;

    const existing = await this.eventModel.findOne({ name });
    if (existing) {
      throw new BadRequestException("이미 동일한 이름의 이벤트가 존재합니다.");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException("이벤트 시작일은 종료일보다 종료일보다 이전이어야 합니다.");
    }

    try {
      return await this.eventModel.create(dto);
    } catch (error) {
      console.error("이벤트 생성 오류:", error);
      throw new InternalServerErrorException("이벤트 생성 중 오류가 발생했습니다.");
    }
  }
}
