import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EventCondition } from "../types/event-condition.enum";

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string = "";

  @Prop()
  description: string = "";

  @Prop({ required: true })
  startDate: Date = new Date();

  @Prop({ required: true })
  endDate: Date = new Date();

  @Prop({ default: "scheduled", enum: ["scheduled", "active", "ended"] })
  status: string = "scheduled";

  @Prop({ default: "once", enum: ["once", "daily", "weekly"] })
  rewardType: string = "once";

  @Prop({ default: 1 })
  maxRewardCount: number = 1;

  @Prop({ required: true, enum: EventCondition })
  condition!: EventCondition;
}

export const EventSchema = SchemaFactory.createForClass(Event);
