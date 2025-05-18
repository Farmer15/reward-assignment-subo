import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UserRole } from "./types/user-role";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { UserService } from "./user.service";

@Controller("auth/users")
export class UserRoleController {
  constructor(private readonly userService: UserService) {}

  @Patch(":id/role")
  async updateUserRole(@Param("id") userId: string, @Body() dto: UpdateUserRoleDto) {
    const result = await this.userService.updateUserRole(userId, dto.role);

    return {
      message: "유저 권한 변경에 성공했습니다.",
      user: result.user,
    };
  }
}
