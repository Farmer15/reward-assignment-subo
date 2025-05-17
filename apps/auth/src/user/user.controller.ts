import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "libs/auth/src/decorators/current-user.decorator";
import { AuthUser } from "../types/auth-user.interface";

@Controller("auth")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return {
      message: "회원가입 성공했습니다.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post("login")
  async login(@Body() dto: LoginUserDto) {
    const user = await this.userService.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: "로그인 성공",
      accessToken: token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProfile(@CurrentUser() user: AuthUser) {
    return {
      message: "내 정보 조회 성공했습니다.",
      user,
    };
  }
}
