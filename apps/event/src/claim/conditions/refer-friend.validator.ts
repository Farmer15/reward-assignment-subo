import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Referral, ReferralDocument } from "libs/schemas/referral.schema";
import { FilterQuery, Model } from "mongoose";

@Injectable()
export class ReferralValidator {
  constructor(
    @InjectModel(Referral.name)
    private readonly referralModel: Model<ReferralDocument>,
  ) {}

  async hasMinimumReferrals(inviterId: string, minimum: number = 3): Promise<boolean> {
    const filter: FilterQuery<ReferralDocument> = { inviterId };
    const count = await this.referralModel.countDocuments(filter);

    return count >= minimum;
  }
}
