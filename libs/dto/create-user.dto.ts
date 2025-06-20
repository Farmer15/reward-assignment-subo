import { IsEmail, IsString, MinLength, IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDto {
  @IsEmail()
  email: string = "";

  @IsString()
  @MinLength(6)
  password: string = "";

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsOptional()
  @IsString()
  inviteCode?: string;
}
