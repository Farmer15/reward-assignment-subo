import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { isValidObjectId, Model } from "mongoose";

@Injectable()
export class UserProfileService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string): Promise<UserDocument> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException("유효하지 않은 유저 ID입니다.");
    }

    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
    }

    return user;
  }
}
