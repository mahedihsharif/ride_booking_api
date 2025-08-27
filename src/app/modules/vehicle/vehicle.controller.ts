import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VehicleService } from "./vehicle.service";

const updateVehicleDetails = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.userId;
  const vehicleDetails = req.body;
  const vehicle = await VehicleService.updateVehicleDetails(
    driverId,
    vehicleDetails
  );
  console.log(vehicle);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vehicle Details updated successfully",
    data: vehicle,
  });
});

export const VehicleController = {
  updateVehicleDetails,
};
