import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types, Document } from "mongoose";

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  name: string = "";

  @Prop()
  description: string = "";

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true })
  eventId!: Types.ObjectId;

  @Prop({ default: 0 })
  quantity: number = 0;

  @Prop({ default: false })
  isLimited: boolean = false;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
