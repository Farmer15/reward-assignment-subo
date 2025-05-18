import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "apps/auth/src/user/dto/create-user.dto";
import { LoginUserDto } from "apps/auth/src/user/dto/login-user.dto";
import { UpdateUserRoleDto } from "apps/auth/src/user/dto/update-user-role.dto";
import { AuthProxyService } from "../proxy/auth.proxy.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { UserRole } from "apps/auth/src/user/types/user-role";
import { Roles } from "libs/auth/src/decorators/roles.decorator";

@Controller("auth")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Post("signup")
  async signup(@Body() dto: CreateUserDto) {
    return await this.authProxyService.signup(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginUserDto) {
    return await this.authProxyService.login(dto);
  }

  @Get("me")
  async getProfile(@Headers("authorization") authHeader: string) {
    const token = authHeader?.split(" ")[1];
    return await this.authProxyService.getProfile(token);
  }

  @Patch("users/:id/role")
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateRole(
    @Param("id") userId: string,
    @Body() dto: UpdateUserRoleDto,
    @Headers("authorization") authHeader: string,
  ) {
    const token = authHeader?.split(" ")[1];
    return await this.authProxyService.updateUserRole(userId, dto, token);
  }
}
