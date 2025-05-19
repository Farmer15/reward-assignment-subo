import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class UserLogin {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  loginAt!: Date;
}

export type UserLoginDocument = UserLogin & Document;
export const UserLoginSchema = SchemaFactory.createForClass(UserLogin);

UserLoginSchema.index({ userId: 1, loginAt: 1 });
