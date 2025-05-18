import { UserRole } from "apps/auth/src/user/types/user-role";

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  token: string;
}
