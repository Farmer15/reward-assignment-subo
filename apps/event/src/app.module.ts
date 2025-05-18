import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventModule } from "./event/event.module";
import { RewardModule } from "./reward/reward.module";
import { ClaimModule } from "./claim/claim.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = process.env.MONGO_URI;

        if (!uri) {
          Logger.error("❌ .env 파일에 MONGO_URI가 설정되어 있지 않습니다.");
          throw new Error("MONGO_URI is not defined");
        }

        Logger.log(`📡 MongoDB 연결 시도 중: ${uri}`);

        return {
          uri,
          connectionFactory: (connection) => {
            Logger.log("✅ MongoDB 연결에 성공했습니다. (event 서비스)");
            return connection;
          },
        };
      },
    }),

    EventModule,
    RewardModule,
    ClaimModule,
  ],
})
export class AppModule {}
