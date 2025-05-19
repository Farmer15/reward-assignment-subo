import { Injectable } from "@nestjs/common";
import { EventCondition } from "../../event/types/event-condition.enum";
import { LoginStreakValidator } from "../conditions/login-streak.validator";
import { User, UserDocument } from "libs/schemas/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BirthdayLoginValidator } from "../conditions/birthday-login.validator";

@Injectable()
export class EventConditionCheckerService {
  constructor(
    private readonly loginStreakValidator: LoginStreakValidator,
    private readonly birthdayLoginValidator: BirthdayLoginValidator,
  ) {}

  async check(userId: string, condition: EventCondition): Promise<boolean> {
    switch (condition) {
      case EventCondition.DAILY_LOGIN_7_DAYS:
        return this.loginStreakValidator.has7DayLoginStreak(userId);

      case EventCondition.REFER_3_FRIENDS:
        // 조건 로직들

        return true;
      case EventCondition.COMPLETE_PROFILE:
        // 조건 로직들

        return true;
      case EventCondition.WRITE_REVIEW:
        // 조건 로직들

        return true;
      case EventCondition.SUBMIT_FEEDBACK:
        // 조건 로직들

        return true;
      case EventCondition.COMPLETE_TUTORIAL:
        // 조건 로직들

        return true;
      case EventCondition.BIRTHDAY_LOGIN:
        return this.birthdayLoginValidator.isBirthdayToday(userId);
      case EventCondition.ANNIVERSARY_LOGIN:
        // 조건 로직들

        return true;
      default:
        return false;
    }
  }
}
