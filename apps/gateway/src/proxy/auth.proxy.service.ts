import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CreateUserDto } from "apps/auth/src/user/dto/create-user.dto";
import { LoginUserDto } from "apps/auth/src/user/dto/login-user.dto";
import { UpdateUserRoleDto } from "apps/auth/src/user/dto/update-user-role.dto";
import { handleAxiosError } from "../common/utils/axios-error.util";

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
      handleAxiosError(error, "로그인 요청 중 오류가 발생했습니다.");
    }
  }

  async getProfile(token: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${process.env.AUTH_SERVICE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (error) {
      handleAxiosError(error, "내 정보 조회 중 오류가 발생했습니다.");
    }
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto, token: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.patch(`${process.env.AUTH_SERVICE_URL}/auth/users/${userId}/role`, dto, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return res.data;
    } catch (error) {
      handleAxiosError(error, "유저 권한 변경 중 오류가 발생했습니다.");
    }
  }
}
