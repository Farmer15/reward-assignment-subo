// @ts-nocheck
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ClaimRewardService } from "@/apps/event/src/claim/services/claim-reward.service";
import { Reward } from "@/apps/event/src/reward/schema/reward.schema";
import { Event } from "@/apps/event/src/event/schemas/event.schema";
import { Claim } from "@/apps/event/src/claim/schema/claim.schema";
import { EventConditionCheckerService } from "@/apps/event/src/claim/services/event-condition-checker.service";
import * as helper from "@/apps/event/src/claim/helpers/save-failed-claim";

jest.spyOn(helper, "saveFailedClaim").mockResolvedValue(undefined);

describe("ClaimRewardService", () => {
  let service;
  let rewardModel;
  let claimModel;
  let eventModel;
  let checker;

  const userId = new Types.ObjectId().toHexString();
  const rewardIdObj = new Types.ObjectId();
  const eventIdObj = new Types.ObjectId();

  beforeEach(async () => {
    rewardModel = {
      findById: jest.fn(),
      updateOne: jest.fn(),
    };

    eventModel = {
      findById: jest.fn(),
    };

    claimModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    checker = {
      check: jest.fn().mockResolvedValue(true),
    };

    const module = await Test.createTestingModule({
      providers: [
        ClaimRewardService,
        { provide: getModelToken(Reward.name), useValue: rewardModel },
        { provide: getModelToken(Event.name), useValue: eventModel },
        { provide: getModelToken(Claim.name), useValue: claimModel },
        { provide: EventConditionCheckerService, useValue: checker },
        {
          provide: "DatabaseConnection",
          useValue: {
            startSession: () => ({
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              abortTransaction: jest.fn(),
              endSession: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get(ClaimRewardService);
  });

  it("보상을 정상적으로 요청해야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: rewardIdObj,
          eventId: eventIdObj,
          isLimited: false,
        }),
    });

    eventModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: eventIdObj,
          status: "active",
          startDate: new Date("2000"),
          endDate: new Date("3000"),
          condition: "DAILY_LOGIN",
        }),
    });

    claimModel.findOne.mockResolvedValue(null);

    claimModel.create.mockResolvedValue([
      {
        _id: new Types.ObjectId(),
        userId,
        rewardId: rewardIdObj,
        eventId: eventIdObj,
        status: "success",
      },
    ]);

    const result = await service.execute(userId, rewardIdObj.toHexString());

    expect(result).toBeDefined();
    expect(claimModel.create).toHaveBeenCalled();
  });

  it("보상을 찾을 수 없으면 NotFoundException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({ session: () => Promise.resolve(null) });

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "보상을 찾을 수 없습니다.",
    );
  });

  it("이벤트가 존재하지 않으면 NotFoundException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () => Promise.resolve({ id: rewardIdObj, eventId: eventIdObj, isLimited: false }),
    });
    eventModel.findById.mockReturnValue({ session: () => Promise.resolve(null) });

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "보상과 연결된 이벤트를 찾을 수 없습니다.",
    );
  });

  it("이벤트가 비활성화 상태이면 BadRequestException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () => Promise.resolve({ id: rewardIdObj, eventId: eventIdObj, isLimited: false }),
    });
    eventModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: eventIdObj,
          status: "inactive",
          startDate: new Date("2000"),
          endDate: new Date("3000"),
          condition: "DAILY_LOGIN",
        }),
    });

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "현재 비활성화된 이벤트입니다.",
    );
  });

  it("이벤트 기간이 아니면 BadRequestException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () => Promise.resolve({ id: rewardIdObj, eventId: eventIdObj, isLimited: false }),
    });
    eventModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: eventIdObj,
          status: "active",
          startDate: new Date("2100"),
          endDate: new Date("2200"),
          condition: "DAILY_LOGIN",
        }),
    });

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "이벤트 기간이 아닙니다.",
    );
  });

  it("이벤트 조건이 만족되지 않으면 BadRequestException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () => Promise.resolve({ id: rewardIdObj, eventId: eventIdObj, isLimited: false }),
    });
    eventModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: eventIdObj,
          status: "active",
          startDate: new Date("2000"),
          endDate: new Date("3000"),
          condition: "DAILY_LOGIN",
        }),
    });
    checker.check.mockResolvedValue(false);

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "이벤트 조건을 만족하지 못했습니다.",
    );
  });

  it("이미 보상을 받은 경우 ConflictException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () => Promise.resolve({ id: rewardIdObj, eventId: eventIdObj, isLimited: false }),
    });

    eventModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: eventIdObj,
          status: "active",
          startDate: new Date("2000"),
          endDate: new Date("3000"),
          condition: "DAILY_LOGIN",
        }),
    });

    claimModel.findOne.mockResolvedValue({
      _id: new Types.ObjectId(),
    });

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "이미 해당 이벤트에 대한 보상을 수령하셨습니다.",
    );
  });

  it("보상이 소진되었으면 BadRequestException을 던져야 합니다", async () => {
    rewardModel.findById.mockReturnValue({
      session: () => Promise.resolve({ id: rewardIdObj, eventId: eventIdObj, isLimited: true }),
    });

    eventModel.findById.mockReturnValue({
      session: () =>
        Promise.resolve({
          id: eventIdObj,
          status: "active",
          startDate: new Date("2000"),
          endDate: new Date("3000"),
          condition: "DAILY_LOGIN",
        }),
    });

    claimModel.findOne.mockResolvedValue(null);

    rewardModel.updateOne.mockResolvedValue({ modifiedCount: 0 });

    await expect(service.execute(userId, rewardIdObj.toHexString())).rejects.toThrow(
      "보상이 모두 소진되었습니다.",
    );
  });
});
