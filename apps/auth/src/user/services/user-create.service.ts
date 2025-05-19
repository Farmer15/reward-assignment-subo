import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "libs/dto/create-user.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Connection, Model } from "mongoose";
import { Referral, ReferralDocument } from "libs/schemas/referral.schema";
import { User, UserDocument } from "libs/schemas/user.schema";

@Injectable()
export class UserCreateService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Referral.name) private referralModel: Model<ReferralDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException("이미 존재하는 이메일입니다.");
    }

    if (dto.password.length < 6) {
      throw new BadRequestException("비밀번호는 최소 6자리 이상이어야 합니다.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const createdUser = new this.userModel({
        email: dto.email,
        password: hashedPassword,
        birthDate: dto.birthDate,
      });

      const savedUser = await createdUser.save({ session });

      if (dto.inviteCode) {
        const inviter = await this.userModel
          .findOne({ inviteCode: dto.inviteCode })
          .session(session);

        if (inviter) {
          await this.referralModel.create(
            [
              {
                inviterId: inviter._id,
                inviteeId: savedUser._id,
              },
            ],
            { session },
          );
        }
      }

      await session.commitTransaction();
      return savedUser;
    } catch (err) {
      await session.abortTransaction();
      throw new InternalServerErrorException("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      session.endSession();
    }
  }
}
