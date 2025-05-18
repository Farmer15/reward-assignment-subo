import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "libs/types/jwt-payload.interface";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const authHeader = req.headers.authorization;
          if (!authHeader) return null;

          const [scheme, token] = authHeader.split(" ");
          return scheme === "Bearer" && token ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      token,
    };
  }
}
