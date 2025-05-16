import { IsString, IsNotEmpty, IsMongoId, IsBoolean, IsInt, Min } from "class-validator";

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  name: string = "";

  @IsString()
  description: string = "";

  @IsMongoId()
  eventId: string = "";

  @IsInt()
  @Min(0)
  quantity: number = 0;

  @IsBoolean()
  isLimited: boolean = false;
}
