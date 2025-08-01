import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
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
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllRiders();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Riders Retrieved Successfully!",
      data: {
        users: result.data,
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
    const userId = req.params.id;
    const decodedToken = req.user;

    const result = await UserService.blockedUser(
      userId,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully!",
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getAllRiders,
  updateUser,
  blockedUser,
};
