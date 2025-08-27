import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ApprovedStatus } from "./driver.interface";
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

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;
    const rideId = req.params.id;
    const { status } = req.body;

    const result = await DriverService.updateStatus(rideId, driverId, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Ride Status: ${result.status}`,
      data: result,
    });
  }
);

const driverEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;

    const result = await DriverService.driverEarnings(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver total earnings history",
      data: {
        rides: result.rides,
        totalEarnings: result.totalEarnings,
        totalCompletedRides: result.totalCompletedRides,
      },
    });
  }
);

const setAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;

    const result = await DriverService.setAvailability(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `You are now ${result.isAvailable ? "Online" : "Offline"}`,
      data: result,
    });
  }
);

const getSingleDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await DriverService.getSingleDriver(decodedToken.userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your Profile Retrieved Successfully!",
      data: result.data,
    });
  }
);

const getAllDrivers = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await DriverService.getAllDrivers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Drivers Retrieved Successfully!",
      data: {
        drivers: result.data,
        meta: result.meta,
      },
    });
  }
);

const getAllDriversInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, search, status } = req.query;

    const drivers = await DriverService.getAllDriversInfo({
      page: Number(page) || 1,
      limit: Number(limit) || 5,
      search: search as string,
      status: status as ApprovedStatus,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Drivers Retrieved Successfully!",
      data: drivers,
    });
  }
);

const approveDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;
    const result = await DriverService.approveDriver(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver approval status is Success!",
      data: result,
    });
  }
);

const suspendDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;
    const result = await DriverService.suspendDriver(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver status is Suspended!",
      data: result,
    });
  }
);

const availableDriver = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await DriverService.availableDriver();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available Drivers",
      data: {
        drivers: result,
      },
    });
  }
);

export const DriverController = {
  acceptRide,
  rejectRide,
  updateStatus,
  driverEarnings,
  setAvailability,
  getAllDrivers,
  approveDriver,
  suspendDriver,
  availableDriver,
  getSingleDriver,
  getAllDriversInfo,
};
