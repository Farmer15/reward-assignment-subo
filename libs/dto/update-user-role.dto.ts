import { IsEnum } from "class-validator";
import { UserRole } from "../../apps/auth/src/user/types/user-role";

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
