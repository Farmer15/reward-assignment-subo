import { Injectable } from "@nestjs/common";
import { EventCondition } from "../../event/types/event-condition.enum";
import { LoginStreakValidator } from "../conditions/login-streak.validator";
import { BirthdayLoginValidator } from "../conditions/birthday-login.validator";
import { AnniversaryLoginValidator } from "../conditions/anniversary-login.validator";
import { CompleteProfileValidator } from "../conditions/complete-profile.validator";
import { ReferralValidator } from "../conditions/refer-friend.validator";

@Injectable()
export class EventConditionCheckerService {
  constructor(
    private readonly loginStreakValidator: LoginStreakValidator,
    private readonly birthdayLoginValidator: BirthdayLoginValidator,
    private readonly anniversaryLoginValidator: AnniversaryLoginValidator,
    private readonly completeProfileValidator: CompleteProfileValidator,
    private readonly referralValidator: ReferralValidator,
  ) {}

  async check(userId: string, condition: EventCondition): Promise<boolean> {
    switch (condition) {
      case EventCondition.DAILY_LOGIN_7_DAYS:
        return await this.loginStreakValidator.hasContinuousLoginStreak(userId, 7);

      case EventCondition.REFER_3_FRIENDS:
        return this.referralValidator.hasMinimumReferrals(userId, 3);

      case EventCondition.COMPLETE_PROFILE:
        return this.completeProfileValidator.isProfileComplete(userId);

      case EventCondition.BIRTHDAY_LOGIN:
        return this.birthdayLoginValidator.isBirthdayToday(userId);

      case EventCondition.ANNIVERSARY_LOGIN:
        return this.anniversaryLoginValidator.isAnniversaryToday(userId);

      default:
        return false;
    }
  }
}
