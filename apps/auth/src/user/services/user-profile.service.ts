import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { UpdateUserProfileDto } from "libs/dto/update-user-profile.dto";
import { User, UserDocument } from "libs/schemas/user.schema";

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

  async getInviteCode(userId: string): Promise<string> {
    try {
      const user = await this.userModel.findById(userId).lean();

      if (!user) {
        throw new NotFoundException("유저를 찾을 수 없습니다.");
      }

      if (typeof user.inviteCode !== "string" || user.inviteCode.trim() === "") {
        throw new InternalServerErrorException("추천 코드가 존재하지 않습니다.");
      }

      return user.inviteCode;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }

      console.error("초대 코드 조회 중 알 수 없는 오류:", error);
      throw new InternalServerErrorException("추천 코드 조회 중 오류가 발생했습니다.");
    }
  }
}
