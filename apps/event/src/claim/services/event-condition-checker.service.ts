import { Injectable } from "@nestjs/common";
import { EventCondition } from "../../event/types/event-condition.enum";
import { LoginStreakValidator } from "../conditions/login-streak.validator";
import { BirthdayLoginValidator } from "../conditions/birthday-login.validator";
import { AnniversaryLoginValidator } from "../conditions/anniversary-login.validator";

@Injectable()
export class EventConditionCheckerService {
  constructor(
    private readonly loginStreakValidator: LoginStreakValidator,
    private readonly birthdayLoginValidator: BirthdayLoginValidator,
    private readonly anniversaryLoginValidator: AnniversaryLoginValidator,
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
        return this.anniversaryLoginValidator.isAnniversaryToday(userId);

      default:
        return false;
    }
  }
}
