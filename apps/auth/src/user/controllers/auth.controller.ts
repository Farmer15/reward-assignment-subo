import { Body, Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "libs/dto/create-user.dto";
import { LoginUserDto } from "libs/dto/login-user.dto";
import { UserAuthService } from "../services/user-auth.service";
import { UserCreateService } from "../services/user-create.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userCreateService: UserCreateService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userCreateService.create(createUserDto);
    return {
      message: "회원가입 성공했습니다.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post("login")
  async login(@Body() dto: LoginUserDto) {
    const user = await this.userAuthService.validateUser(dto.email, dto.password);
    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      message: "로그인 성공",
      accessToken: token,
    };
  }
}
