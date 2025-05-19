import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "libs/dto/create-user.dto";
import { LoginUserDto } from "libs/dto/login-user.dto";
import { UpdateUserRoleDto } from "libs/dto/update-user-role.dto";
import { AuthProxyService } from "../proxy/auth.proxy.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "libs/decorators/roles.decorator";
import { Public } from "libs/decorators/public.decorator";
import { AuthUser } from "libs/types/auth-user.interface";
import { CurrentUser } from "libs/decorators/current-user.decorator";
import { UserRole } from "libs/types/user-role";
import { UpdateUserProfileDto } from "libs/dto/update-user-profile.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Public()
  @Post("signup")
  async signup(@Body() dto: CreateUserDto) {
    return this.authProxyService.signup(dto);
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginUserDto) {
    return this.authProxyService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@CurrentUser() user: AuthUser) {
    return this.authProxyService.getProfile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  async updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserProfileDto) {
    return this.authProxyService.updateUserProfile(user, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("users/:id/role")
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateRole(
    @Param("id") targetUserId: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() operator: AuthUser,
  ) {
    return this.authProxyService.updateUserRole(targetUserId, dto, operator);
  }
}
