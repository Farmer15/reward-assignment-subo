import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "libs/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class AnniversaryLoginValidator {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async isAnniversaryToday(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).lean();

    if (!user || !user.createdAt) {
      return false;
    }

    const today = new Date();
    const created = new Date(user.createdAt);

    return today.getMonth() === created.getMonth() && today.getDate() === created.getDate();
  }
}
