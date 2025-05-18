import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { AuthUser } from "../types/auth-user.interface";
import { UserProfileService } from "../services/user-profile.service";

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
}
