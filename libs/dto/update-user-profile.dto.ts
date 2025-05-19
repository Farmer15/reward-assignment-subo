import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
