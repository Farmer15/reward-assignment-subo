import { IsString, IsDateString, IsNumber } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string = "";

  @IsString()
  description: string = "";

  @IsDateString()
  startDate: string = "";

  @IsDateString()
  endDate: string = "";

  @IsString()
  status: "scheduled" | "active" | "ended" = "scheduled";

  @IsString()
  rewardType: "once" | "daily" | "weekly" = "once";

  @IsNumber()
  maxRewardCount: number = 1;
}
