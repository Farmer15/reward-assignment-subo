import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("auth")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return {
      message: "회원가입 성공",
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }
}
