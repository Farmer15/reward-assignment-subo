import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ClaimDocument = Claim & Document;

@Schema({ timestamps: true })
export class Claim {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId = new Types.ObjectId();

  @Prop({ type: Types.ObjectId, required: true, ref: "Reward" })
  rewardId: Types.ObjectId = new Types.ObjectId();

  @Prop({ enum: ["success", "failed"], required: true })
  status: "success" | "failed" = "failed";

  @Prop()
  reason?: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
