import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RewardController } from "./controllers/reward.controller";
import { RewardService } from "./services/reward.service";
import { RewardCreateService } from "./services/reward-create.service";

import { Reward, RewardSchema } from "./schema/reward.schema";
import { Event, EventSchema } from "../event/schemas/event.schema";
import { RewardFetchService } from "./services/reward-fetch.service";
import { RewardCreateController } from "./controllers/reward-create.controller";
import { RewardReadController } from "./controllers/reward-read.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [RewardCreateController, RewardReadController, RewardController],
  providers: [RewardService, RewardCreateService, RewardFetchService],
})
export class RewardModule {}
