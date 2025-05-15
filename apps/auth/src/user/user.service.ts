import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: createUserDto.email });

    if (existing) {
      throw new ConflictException("이미 존재하는 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("존재하지 않는 이메일입니다.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    return user;
  }
}
