import { IsString, IsDateString, IsIn, IsNumber, Min, IsNotEmpty, IsEnum } from "class-validator";
import { EventCondition } from "../../apps/event/src/event/types/event-condition.enum";

export class CreateEventDto {
  @IsString()
  name: string = "";

  @IsString()
  description: string = "";

  @IsDateString({}, { message: "유효한 시작일 형식이 아닙니다." })
  startDate!: string;

  @IsDateString({}, { message: "유효한 종료일 형식이 아닙니다." })
  endDate!: string;

  @IsIn(["scheduled", "active", "ended"])
  status: "scheduled" | "active" | "ended" = "scheduled";

  @IsIn(["once", "daily", "weekly"])
  rewardType: "once" | "daily" | "weekly" = "once";

  @IsNumber()
  @Min(1)
  maxRewardCount: number = 1;

  @IsEnum(EventCondition)
  condition!: EventCondition;
}
