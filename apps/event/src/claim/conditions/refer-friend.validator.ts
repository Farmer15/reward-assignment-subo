import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Referral, ReferralDocument } from "libs/schemas/referral.schema";
import { Model } from "mongoose";

@Injectable()
export class ReferFriendValidator {
  constructor(
    @InjectModel(Referral.name)
    private readonly referralModel: Model<ReferralDocument>,
  ) {}

  async hasReferredAtLeast3(userId: string): Promise<boolean> {
    const count = await this.referralModel.countDocuments({ inviterId: userId });
    return count >= 3;
  }
}
