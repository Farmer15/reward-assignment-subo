import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserRole } from "../types/user-role";

export type UserDocument = User & Document;

@Schema()
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string = "";

  @Prop({ required: true })
  password: string = "";

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Prop({ default: Date.now })
  createdAt: Date = new Date();
}

export const UserSchema = SchemaFactory.createForClass(User);
