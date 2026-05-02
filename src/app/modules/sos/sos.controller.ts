import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SOSService } from "./sos.service";

const sendSOS = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { message, rideId } = req.body;
  const result = await SOSService.sendSOS(userId, rideId, message);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const SOSController = {
  sendSOS,
};
