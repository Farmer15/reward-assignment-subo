import { IsString, IsDateString, IsIn, IsNumber, Min } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string = "";

  @IsString()
  description: string = "";

  @IsDateString()
  startDate: string = "";

  @IsDateString()
  endDate: string = "";

  @IsIn(["scheduled", "active", "ended"])
  status: "scheduled" | "active" | "ended" = "scheduled";

  @IsIn(["once", "daily", "weekly"])
  rewardType: "once" | "daily" | "weekly" = "once";

  @IsNumber()
  @Min(1)
  maxRewardCount: number = 1;
}
