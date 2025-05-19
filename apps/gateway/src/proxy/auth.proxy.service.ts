import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CreateUserDto } from "libs/dto/create-user.dto";
import { LoginUserDto } from "libs/dto/login-user.dto";
import { UpdateUserRoleDto } from "libs/dto/update-user-role.dto";
import { handleAxiosError } from "../common/utils/axios-error.util";
import { AuthUser } from "libs/types/auth-user.interface";
import { UpdateUserProfileDto } from "libs/dto/update-user-profile.dto";

@Injectable()
export class AuthProxyService {
  constructor(private readonly httpService: HttpService) {}

  async signup(data: CreateUserDto) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.AUTH_SERVICE_URL}/auth/signup`, data),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "회원가입 중 오류가 발생했습니다.");
    }
  }

  async login(data: LoginUserDto) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.AUTH_SERVICE_URL}/auth/login`, data),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "로그인 요청 중 오류가 발생했습니다.");
    }
  }

  async getProfile(user: AuthUser) {
    return {
      message: "내 정보 조회 성공했습니다.",
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }

  async updateUserProfile(user: AuthUser, dto: UpdateUserProfileDto) {
    try {
      const res = await firstValueFrom(
        this.httpService.patch(`${process.env.AUTH_SERVICE_URL}/auth/profile`, dto, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "프로필 수정 중 오류가 발생했습니다.");
    }
  }

  async updateUserRole(targetUserId: string, dto: UpdateUserRoleDto, operator: AuthUser) {
    try {
      const res = await firstValueFrom(
        this.httpService.patch(
          `${process.env.AUTH_SERVICE_URL}/auth/users/${targetUserId}/role`,
          dto,
          {
            headers: { Authorization: `Bearer ${operator.token}` }, // 만약 JwtStrategy에서 token도 넣었다면
          },
        ),
      );

      return res.data;
    } catch (error) {
      console.error(error);
      handleAxiosError(error, "유저 권한 변경 중 오류가 발생했습니다.");
    }
  }
}
