import { Model } from "mongoose";
import { Claim, ClaimDocument } from "../schema/claim.schema";

export async function saveFailedClaim(
  model: Model<ClaimDocument>,
  userId: string,
  rewardId: string,
  reason: string,
): Promise<Claim> {
  try {
    const [created] = await model.create([{ userId, rewardId, status: "failed", reason }]);
    return created;
  } catch (error) {
    console.error("실패 보상 이력 저장 중 오류:", error);
    throw new Error("보상 이력 저장 중 오류가 발생했습니다.");
  }
}
