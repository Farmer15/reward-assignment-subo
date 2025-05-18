import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "./schemas/event.schema";
import { EventCreateController } from "./controllers/event-create.controller";
import { EventCreateService } from "./services/event-create.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  controllers: [EventCreateController],
  providers: [EventCreateService],
})
export class EventModule {}
