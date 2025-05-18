import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Connection, Model } from "mongoose";
import { UserRole } from "../types/user-role";
import { UpdateUserRoleResult } from "../types/user-service.types";

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async updateUserRole(userId: string, role: UserRole): Promise<UpdateUserRoleResult> {
    const session = await this.connection.startSession();

    try {
      let result: UpdateUserRoleResult | null = null;

      await session.withTransaction(async () => {
        const user = await this.userModel.findById(userId).session(session);

        if (!user) {
          throw new NotFoundException("해당 ID의 유저를 찾을 수 없습니다.");
        }

        if (!Object.values(UserRole).includes(role)) {
          throw new BadRequestException("유효하지 않은 역할입니다.");
        }

        if (user.role === role) {
          throw new ConflictException("이미 해당 역할을 가진 유저입니다.");
        }

        user.role = role;
        const updatedUser = await user.save({ session });

        result = {
          message: "역할이 성공적으로 변경되었습니다.",
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
          },
        };
      });

      if (!result) {
        throw new InternalServerErrorException("트랜잭션 처리 중 오류가 발생했습니다.");
      }

      return result;
    } finally {
      await session.endSession();
    }
  }
}
