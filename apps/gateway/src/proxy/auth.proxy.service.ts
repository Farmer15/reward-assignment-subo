import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { CreateUserDto } from "apps/auth/src/user/dto/create-user.dto";
import { LoginUserDto } from "apps/auth/src/user/dto/login-user.dto";
import { UpdateUserRoleDto } from "apps/auth/src/user/dto/update-user-role.dto";
import { AxiosError } from "axios";

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
      this.handleHttpError(error, "회원가입 중 오류가 발생했습니다.");
    }
  }

  async login(data: LoginUserDto) {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${process.env.AUTH_SERVICE_URL}/auth/login`, data),
      );
      return res.data;
    } catch (error) {
      this.handleHttpError(error, "로그인 요청 중 오류가 발생했습니다.");
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
      this.handleHttpError(error, "내 정보 조회 중 오류가 발생했습니다.");
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
      this.handleHttpError(error, "유저 권한 변경 중 오류가 발생했습니다.");
    }
  }

  private handleHttpError(error: unknown, defaultMessage: string): never {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || defaultMessage;

      if (status === 400) {
        throw new BadRequestException(message);
      } else if (status === 401) {
        throw new UnauthorizedException(message);
      } else {
        throw new InternalServerErrorException(message);
      }
    }

    throw new InternalServerErrorException(defaultMessage);
  }
}
