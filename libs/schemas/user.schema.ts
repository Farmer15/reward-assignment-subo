import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "libs/types/user-role";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({ type: Date, required: true })
  birthDate!: Date;

  @Prop({ default: "" })
  nickname?: string;

  @Prop({ default: "" })
  bio?: string;

  @Prop({ default: "" })
  profileImageUrl?: string;

  @Prop({ required: true, unique: true, default: uuidv4 })
  inviteCode!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
