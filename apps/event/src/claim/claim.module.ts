import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Claim, ClaimSchema } from "./schema/claim.schema";
import { Reward, RewardSchema } from "../reward/schema/reward.schema";
import { ClaimHistoryController } from "./controllers/claim-history.controller";
import { EventSchema } from "../event/schemas/event.schema";
import { ClaimQueryService } from "./services/claim-query.service";
import { ClaimRewardService } from "./services/claim-reward.service";
import { EventConditionCheckerService } from "./services/event-condition-checker.service";
import { UserLogin, UserLoginSchema } from "libs/schemas/user-login.schema";
import { LoginStreakValidator } from "./conditions/login-streak.validator";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Claim.name, schema: ClaimSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: Event.name, schema: EventSchema },
      { name: UserLogin.name, schema: UserLoginSchema },
    ]),
  ],
  controllers: [ClaimHistoryController, ClaimHistoryController],
  providers: [
    ClaimQueryService,
    ClaimRewardService,
    EventConditionCheckerService,
    LoginStreakValidator,
  ],
})
export class ClaimModule {}
