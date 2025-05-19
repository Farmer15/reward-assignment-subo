import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "libs/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class BirthdayLoginValidator {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async isBirthdayToday(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).lean();
    if (!user || !user.birthDate) return false;

    const today = new Date();
    const birth = new Date(user.birthDate);

    return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
  }
}
