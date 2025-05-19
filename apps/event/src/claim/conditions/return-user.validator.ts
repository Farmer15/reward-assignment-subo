import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { UserLogin, UserLoginDocument } from "libs/schemas/user-login.schema";

@Injectable()
export class ReturnUserValidator {
  constructor(
    @InjectModel(UserLogin.name)
    private readonly userLoginModel: Model<UserLoginDocument>,
  ) {}

  async isReturnedAfterInactivity(userId: string, inactiveDays = 30): Promise<boolean> {
    const today = this.normalizeDate(new Date());

    const threshold = new Date(today);
    threshold.setDate(today.getDate() - inactiveDays);

    const latestLogin = await this.userLoginModel.findOne({ userId }).sort({ loginAt: -1 }).lean();

    if (latestLogin === null) {
      return false;
    }

    const lastLoginDate = this.normalizeDate(new Date(latestLogin.loginAt));
    const hasLoggedInToday = lastLoginDate.getTime() === today.getTime();

    const priorLoginExists = await this.userLoginModel.exists({
      userId,
      loginAt: { $lt: threshold },
    });

    return hasLoggedInToday && priorLoginExists !== null;
  }

  private normalizeDate(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
