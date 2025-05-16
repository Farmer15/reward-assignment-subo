import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "libs/auth/src/guards/roles.guard";
import { Roles } from "libs/auth/src/decorators/roles.decorator";
import { UserRole } from "./types/user-role";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { UserService } from "./user.service";

@Controller("auth/users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserRoleController {
  constructor(private readonly userService: UserService) {}

  @Patch(":id/role")
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateUserRole(@Param("id") userId: string, @Body() dto: UpdateUserRoleDto) {
    const updated = await this.userService.updateUserRole(userId, dto.role);

    return {
      message: "유저 권한 변경에 성공했습니다.",
      user: updated,
    };
  }
}
