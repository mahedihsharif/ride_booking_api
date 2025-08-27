import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RideService } from "./ride.service";

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user.userId;
  const result = await RideService.requestRide(riderId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ride requested successfully.",
    data: result,
  });
});

const getRiderAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const riderId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const filters = {
      status: req.query.status as string,
      fareMin: req.query.fareMin
        ? parseInt(req.query.fareMin as string)
        : undefined,
      fareMax: req.query.fareMax
        ? parseInt(req.query.fareMax as string)
        : undefined,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
    };

    const result = await RideService.getRiderAllRides(
      riderId,
      limit,
      skip,
      filters
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Rides Retrieved Successfully!",
      data: {
        meta: result.meta,
        data: result.data,
      },
    });
  }
);
const getDriverAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const filters = {
      status: req.query.status as string,
      fareMin: req.query.fareMin
        ? parseInt(req.query.fareMin as string)
        : undefined,
      fareMax: req.query.fareMax
        ? parseInt(req.query.fareMax as string)
        : undefined,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
    };

    const result = await RideService.getDriverAllRides(
      driverId,
      limit,
      skip,
      filters
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Rides Retrieved Successfully!",
      data: {
        meta: result.meta,
        data: result.data,
      },
    });
  }
);
const getRiderSingleRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;

    const verifiedToken = req.user;

    const result = await RideService.getRiderSingleRide(
      rideId,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride Retrieved Successfully!",
      data: result,
    });
  }
);

const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const userId = req.user.userId;
    const result = await RideService.cancelRide(rideId, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride Cancelled",
      data: result,
    });
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, status, driver, rider, startDate, endDate } =
      req.query;

    const result = await RideService.getAllRides({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status: status as string,
      driver: driver as string,
      rider: rider as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Rides Retrieved Successfully!",
      data: {
        data: result.data,
        meta: result.meta,
      },
    });
  }
);

const getAllRidesHistory = catchAsync(
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAllRidesHistory();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Rides History Retrieved Successfully!",
      data: {
        rides: result.data,
        meta: result.meta,
      },
    });
  }
);

const ridesAvailable = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;
    const result = await RideService.ridesAvailable(driverId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available rides",
      data: {
        rides: result,
      },
    });
  }
);
const getSingleRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id as string;
    const driverId = req.user.userId;
    const result = await RideService.getSingleRide(driverId, rideId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride Retrieved successfully",
      data: result,
    });
  }
);
const activeRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id as string;
    const riderId = req.user.userId;
    const result = await RideService.activeRide(rideId, riderId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride Retrieved successfully",
      data: result,
    });
  }
);
const getAllCompletedRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.user.userId;
    const result = await RideService.getAllCompletedRides(driverId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Completed Rides Retrieved Successfully",
      data: {
        data: result.data,
        meta: result.meta,
      },
    });
  }
);

export const RideController = {
  requestRide,
  getRiderAllRides,
  getRiderSingleRide,
  cancelRide,
  getAllRides,
  ridesAvailable,
  getAllRidesHistory,
  getAllCompletedRides,
  getDriverAllRides,
  getSingleRide,
  activeRide,
};
