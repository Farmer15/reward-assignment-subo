import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

import { AuthController } from "./controllers/auth.controller";
import { AuthProxyService } from "./proxy/auth.proxy.service";

import { JwtStrategy } from "./auth/jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { ClaimController } from "./controllers/claim.controller";
import { ClaimProxyService } from "./proxy/claim.proxy.service";
import { EventController } from "./controllers/event.controller";
import { EventProxyService } from "./proxy/event.proxy.service";
import { RewardController } from "./controllers/reward.controller";
import { RewardProxyService } from "./proxy/reward.proxy.service";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  controllers: [AuthController, ClaimController, EventController, RewardController],
  providers: [
    AuthProxyService,
    ClaimProxyService,
    EventProxyService,
    RewardProxyService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
