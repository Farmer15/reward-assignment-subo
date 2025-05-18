import { IsString, IsNotEmpty, IsMongoId, IsBoolean, IsInt, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  name: string = "";

  @IsString()
  description: string = "";

  @IsMongoId()
  eventId!: Types.ObjectId;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantity!: number;

  @IsBoolean()
  isLimited: boolean = false;
}
