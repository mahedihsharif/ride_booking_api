import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getEarningStats = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.userId;
  const stats = await StatsService.getEarningStats(driverId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Earnings stats fetched successfully",
    data: stats,
  });
});

export const StatsController = {
  getEarningStats,
};
