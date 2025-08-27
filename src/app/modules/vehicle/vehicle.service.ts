import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Driver } from "../driver/driver.model";
import { IVehicle } from "./vehicle.interface";

const updateVehicleDetails = async (
  driverId: string,
  vehicleDetails: Partial<IVehicle>
) => {
  const driverObjectId = new mongoose.Types.ObjectId(driverId);
  const driverInfo = await Driver.findOne({ user: driverObjectId });

  if (!driverInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver Not Found");
  }

  const updatedVehicle = await Driver.findOneAndUpdate(
    { user: driverObjectId },

    { $set: { vehicle: vehicleDetails } },

    { new: true, runValidators: true }
  );
  console.log(updatedVehicle);
  return updatedVehicle;
};

export const VehicleService = { updateVehicleDetails };
