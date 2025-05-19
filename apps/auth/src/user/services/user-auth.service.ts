import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../../../../libs/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { UserLogin, UserLoginDocument } from "../../../../../libs/schemas/user-login.schema";

@Injectable()
export class UserAuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserLogin.name)
    private userLoginModel: Model<UserLoginDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException("해당 이메일로 등록된 유저가 없습니다.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    await this.userLoginModel.create({
      userId: user._id,
      loginAt: new Date(),
    });

    return user;
  }
}
