import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ActiveStatus } from "./user.interface";
import { UserService } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully!",
      data: result,
    });
  }
);

const getAllRiders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const status = req.query.status as string | undefined;
    const result = await UserService.getAllRiders(
      searchTerm,
      page,
      limit,
      status
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Riders Retrieved Successfully!",
      data: {
        riders: result.data,
        meta: result.meta,
      },
    });
  }
);

const getAllDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const result = await UserService.getAllDrivers(searchTerm, page, limit);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Riders Retrieved Successfully!",
      data: {
        drivers: result.data,
        meta: result.meta,
      },
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const result = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully!",
      data: result,
    });
  }
);

const blockedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const decodedToken = req.user as JwtPayload;

    const { isActive: status } = req.body;

    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "User ID is required!");
    }

    if (
      !status ||
      ![ActiveStatus.ACTIVE, ActiveStatus.BLOCKED].includes(status)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid status value!");
    }

    const result = await UserService.blockedUser(userId, decodedToken, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User status updated successfully!",
      data: result,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getMe(decodedToken.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your Profile Retrieved Successfully!",
      data: result.data,
    });
  }
);
export const UserController = {
  createUser,
  getAllRiders,
  updateUser,
  blockedUser,
  getMe,
  getAllDrivers,
};
