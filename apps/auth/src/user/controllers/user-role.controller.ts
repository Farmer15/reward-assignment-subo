import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UserRoleService } from "../services/user-role.service";
import { UpdateUserRoleDto } from "libs/dto/update-user-role.dto";

@Controller("auth/users")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Patch(":id/role")
  async updateUserRole(@Param("id") userId: string, @Body() dto: UpdateUserRoleDto) {
    const result = await this.userRoleService.updateUserRole(userId, dto.role);

    return {
      message: "유저 권한 변경에 성공했습니다.",
      user: result.user,
    };
  }
}
