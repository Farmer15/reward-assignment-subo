import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserProfileDto } from "libs/dto/update-user-profile.dto";
import { User, UserDocument } from "libs/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserUpdateService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException("유저를 발견하지 못했습니다.");
    }

    if (dto.nickname && dto.nickname !== user.nickname) {
      const exists = await this.userModel.exists({ nickname: dto.nickname });
      if (exists) {
        throw new ConflictException("이미 사용 중인 닉네임입니다.");
      }
    }

    let isModified = false;

    if (dto.nickname !== undefined && dto.nickname !== user.nickname) {
      user.nickname = dto.nickname;
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
