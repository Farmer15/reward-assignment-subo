import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "libs/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class CompleteProfileValidator {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async isProfileComplete(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      return false;
    }

    const hasNickname = typeof user.nickname === "string" && user.nickname.trim() !== "";
    const hasBio = typeof user.bio === "string" && user.bio.trim() !== "";
    const hasProfileImage =
      typeof user.profileImageUrl === "string" && user.profileImageUrl.trim() !== "";
    const hasBirthDate = user.birthDate instanceof Date && !Number.isNaN(user.birthDate.getTime());

    return hasNickname && hasBio && hasBirthDate && hasProfileImage;
  }
}
