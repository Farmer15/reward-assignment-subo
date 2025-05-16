import { IsEnum } from "class-validator";
import { UserRole } from "../types/user-role";

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}
