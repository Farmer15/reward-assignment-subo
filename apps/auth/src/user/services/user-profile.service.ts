import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../../../../libs/schemas/user.schema";
import { isValidObjectId, Model } from "mongoose";
import { UpdateUserProfileDto } from "libs/dto/update-user-profile.dto";

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

  async updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("유저를 발견하지 못했습니다.");
    }

    const trimmedNickname = dto.nickname?.trim();
    if (trimmedNickname === "") {
      throw new BadRequestException("닉네임은 공백만으로 구성될 수 없습니다.");
    }

    if (trimmedNickname && trimmedNickname !== user.nickname) {
      const exists = await this.userModel.exists({
        nickname: trimmedNickname,
        _id: { $ne: user._id },
      });

      if (exists) {
        throw new ConflictException("이미 사용 중인 닉네임입니다.");
      }
    }

    let isModified = false;

    if (trimmedNickname !== undefined && trimmedNickname !== user.nickname) {
      user.nickname = trimmedNickname;
      isModified = true;
    }

    if (dto.bio !== undefined && dto.bio !== user.bio) {
      user.bio = dto.bio;
      isModified = true;
    }

    if (dto.profileImageUrl !== undefined && dto.profileImageUrl !== user.profileImageUrl) {
      user.profileImageUrl = dto.profileImageUrl;
      isModified = true;
    }

    if (isModified) {
      await user.save();
    }

    return user;
  }
}
