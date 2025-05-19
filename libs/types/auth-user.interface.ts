import { UserRole } from "./user-role";


export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  token: string;
}
