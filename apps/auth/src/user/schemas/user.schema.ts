import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string = "";

  @Prop({ required: true })
  password: string = "";

  @Prop({ default: Date.now })
  createdAt: Date = new Date();

  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
