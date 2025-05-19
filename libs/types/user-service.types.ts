import { UserRole } from "./user-role";

export interface UpdateUserRoleResult {
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
