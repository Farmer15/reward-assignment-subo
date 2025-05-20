import { Model } from "mongoose";
import { Claim, ClaimDocument } from "../schema/claim.schema";

export async function saveFailedClaim(
  claimModel: Model<ClaimDocument>,
  userId: string,
  rewardId: string,
  reason: string,
): Promise<Claim | null> {
  try {
    const created = await claimModel.create([
      {
        userId,
        rewardId,
        eventId: null,
        status: "failed",
        failReason: reason,
      },
    ]);

    if (!Array.isArray(created) || created.length === 0) {
      throw new Error("create 반환값이 유효하지 않습니다");
    }

    return created[0];
  } catch (error) {
    console.error("실패 보상 이력 저장 중 오류:", error);
    throw new Error("보상 이력 저장 중 오류가 발생했습니다.");
  }
}
