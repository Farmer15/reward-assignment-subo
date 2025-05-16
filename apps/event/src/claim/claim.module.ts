import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClaimController } from "./claim.controller";
import { ClaimService } from "./claim.service";
import { Claim, ClaimSchema } from "./schema/claim.schema";
import { Reward, RewardSchema } from "../reward/schema/reward.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Claim.name, schema: ClaimSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
})
export class ClaimModule {}
