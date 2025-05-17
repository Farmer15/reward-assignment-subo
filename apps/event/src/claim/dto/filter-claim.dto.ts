import { IsOptional, IsMongoId, IsIn } from "class-validator";

export class FilterClaimDto {
  @IsOptional()
  @IsMongoId()
  eventId?: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsIn(["success", "failed"])
  status?: "success" | "failed";
}
