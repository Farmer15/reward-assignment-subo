import { EventCondition } from "../../event/types/event-condition.enum";

export async function checkEventCondition(userId: string, condition: string): Promise<boolean> {
  switch (condition) {
    case EventCondition.DAILY_LOGIN_7_DAYS:
      // 조건 로직들

      return true;
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
      // 조건 로직들

      return true;
    case EventCondition.ANNIVERSARY_LOGIN:
      // 조건 로직들

      return true;

    default:
      return false;
  }
}
