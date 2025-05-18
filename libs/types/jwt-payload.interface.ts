import { UserRole } from "apps/auth/src/user/types/user-role";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
