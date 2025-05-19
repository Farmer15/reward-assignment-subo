import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../../../libs/schemas/user.schema";
import { UserRoleController } from "./controllers/user-role.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./controllers/auth.controller";
import { ProfileController } from "./controllers/profile.controller";
import { UserCreateService } from "./services/user-create.service";
import { UserAuthService } from "./services/user-auth.service";
import { UserRoleService } from "./services/user-role.service";
import { UserProfileService } from "./services/user-profile.service";
import { UserLogin, UserLoginSchema } from "../../../../libs/schemas/user-login.schema";
import { Referral, ReferralSchema } from "libs/schemas/referral.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserLogin.name, schema: UserLoginSchema },
      { name: Referral.name, schema: ReferralSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController, ProfileController, UserRoleController],
  providers: [UserCreateService, UserAuthService, UserRoleService, UserProfileService],
  exports: [UserCreateService, UserAuthService, UserRoleService, UserProfileService],
})
export class UserModule {}
