import { Body, Controller, Get, Patch } from "@nestjs/common";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { AuthUser } from "libs/types/auth-user.interface";
import { UserProfileService } from "../services/user-profile.service";
import { UpdateUserProfileDto } from "libs/dto/update-user-profile.dto";

@Controller("auth")
export class ProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get("me")
  async getProfile(@CurrentUser() user: AuthUser) {
    const profile = await this.userProfileService.getProfile(user.userId);
    return {
      message: "내 정보 조회 성공했습니다.",
      user: {
        id: profile._id,
        email: profile.email,
        role: profile.role,
      },
    };
  }

  @Patch("profile")
  async updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserProfileDto) {
    const updated = await this.userProfileService.updateProfile(user.userId, dto);

    return {
      message: "프로필 수정에 성공했습니다.",
      user: {
        id: updated._id,
        email: updated.email,
        nickname: updated.nickname,
        bio: updated.bio,
        profileImageUrl: updated.profileImageUrl,
      },
    };
  }
}
