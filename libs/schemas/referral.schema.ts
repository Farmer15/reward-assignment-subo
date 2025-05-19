import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

@Schema({ timestamps: true })
export class Referral {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  inviterId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  inviteeId!: Types.ObjectId;
}

export type ReferralDocument = Referral & Document;
export const ReferralSchema = SchemaFactory.createForClass(Referral);

ReferralSchema.index({ inviteeId: 1 }, { unique: true });
