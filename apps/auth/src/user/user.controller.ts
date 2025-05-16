import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

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
        id: user._id,
        email: user.email,
      },
    };
  }

  @Post("login")
  async login(@Body() dto: LoginUserDto) {
    const user = await this.userService.validateUser(dto.email, dto.password);

    if (!user._id) {
      throw new InternalServerErrorException("유저 ID가 존재하지 않습니다.");
    }

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: "로그인 성공",
      accessToken: token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProfile(@Req() req: Request) {
    return {
      message: "내 정보 조회 성공했습니다.",
      user: req.user,
    };
  }
}
