import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DriverService } from "./driver.service";

const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const driverId = req.user.userId;

    const result = await DriverService.acceptRide(rideId, driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride Accepted",
      data: result,
    });
  }
);

const rejectRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const driverId = req.user.userId;

    const result = await DriverService.rejectRide(rideId, driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride Rejected",
      data: result,
    });
  }
);

export const DriverController = { acceptRide, rejectRide };
