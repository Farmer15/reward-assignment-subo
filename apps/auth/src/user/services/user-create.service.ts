import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { User, UserDocument } from "../../../../../libs/schemas/user.schema";
import { CreateUserDto } from "libs/dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

@Injectable()
export class UserCreateService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: dto.email });

    if (existing) {
      throw new ConflictException("이미 존재하는 이메일입니다.");
    }

    if (dto.password.length < 6) {
      throw new BadRequestException("비밀번호는 최소 6자리 이상이어야 합니다.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createdUser = new this.userModel({
      email: dto.email,
      password: hashedPassword,
      birthDate: dto.birthDate,
    });

    return await createdUser.save();
  }
}
