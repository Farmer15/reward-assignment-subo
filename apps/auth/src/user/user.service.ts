import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRole } from "./types/user-role";
import { UpdateUserRoleResult } from "./types/user-service.types";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async updateUserRole(userId: string, role: UserRole): Promise<UpdateUserRoleResult> {
    const session = await this.connection.startSession();

    try {
      let result;

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
            id: updatedUser._id,
            email: updatedUser.email,
            role: updatedUser.role,
          },
        };
      });

      if (!result) {
        throw new InternalServerErrorException("트랜잭션 처리 중 알 수 없는 오류가 발생했습니다.");
      }

      return result;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new InternalServerErrorException("역할 변경 중 서버 오류가 발생했습니다.");
    } finally {
      await session.endSession();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: createUserDto.email });
    if (existing) {
      throw new ConflictException("이미 존재하는 이메일입니다.");
    }

    if (createUserDto.password.length < 6) {
      throw new BadRequestException("비밀번호는 최소 6자리 이상이어야 합니다.");
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createdUser = new this.userModel({
        email: createUserDto.email,
        password: hashedPassword,
      });

      return await createdUser.save();
    } catch (error) {
      throw new InternalServerErrorException("회원가입 중 서버 오류가 발생했습니다.");
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException("해당 이메일로 등록된 유저가 없습니다.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    return user;
  }
}
