import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { analyticsService } from "./analytics.service";

export const getRideVolume = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const period = (req.query.period as "day" | "month") || "day";
    const data = await analyticsService.getRideVolume(period);
    res.json({ success: true, data });
  }
);

export const getRevenueTrends = catchAsync(
  async (req: Request, res: Response) => {
    const period = (req.query.period as "day" | "month") || "day";
    const data = await analyticsService.getRevenueTrends(period);
    res.json({ success: true, data });
  }
);

export const getDriverActivity = catchAsync(
  async (req: Request, res: Response) => {
    const data = await analyticsService.getDriverActivity();
    res.json({ success: true, data });
  }
);
