import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = process.env.MONGO_URI;

        if (!uri) {
          Logger.error("❌ MONGO_URI is not defined in .env file");
          throw new Error("MONGO_URI is not defined");
        }

        try {
          Logger.log(`📡 Connecting to MongoDB: ${uri}`);
          return {
            uri,
            connectionFactory: (connection) => {
              Logger.log("✅ MongoDB 연결 성공했습니다. (event service)");
              return connection;
            },
          };
        } catch (error) {
          Logger.error("❌ MongoDB 연결 실패했습니다.", error);
          throw error;
        }
      },
    }),
  ],
})
export class AppModule {}
