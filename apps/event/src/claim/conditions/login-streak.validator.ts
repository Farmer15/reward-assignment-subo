import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { UserLogin, UserLoginDocument } from "libs/schemas/user-login.schema";

@Injectable()
export class LoginStreakValidator {
  constructor(
    @InjectModel(UserLogin.name)
    private readonly userLoginModel: Model<UserLoginDocument>,
  ) {}

  async hasContinuousLoginStreak(userId: string, days: number): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));

    const logs = await this.userLoginModel
      .find({
        userId,
        loginAt: { $gte: start, $lte: today },
      })
      .sort({ loginAt: 1 })
      .lean();

    let count = 0;
    let prevDate: Date | null = null;

    for (const log of logs) {
      const currDate = new Date(log.loginAt);
      currDate.setHours(0, 0, 0, 0);

      if (prevDate?.getTime() === currDate.getTime()) {
        continue;
      }

      if (prevDate) {
        const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff !== 1) {
          return false;
        }
      }

      count += 1;
      prevDate = currDate;
    }

    return count === days;
  }
}
