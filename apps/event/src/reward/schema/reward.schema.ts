import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  name: string = "";

  @Prop()
  description: string = "";

  @Prop({ required: true, type: Types.ObjectId, ref: "Event" })
  eventId: Types.ObjectId = new Types.ObjectId();

  @Prop({ default: 0 })
  quantity: number = 0;

  @Prop({ default: false })
  isLimited: boolean = false;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
