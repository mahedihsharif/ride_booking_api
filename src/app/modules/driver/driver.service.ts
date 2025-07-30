import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";

const acceptRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  if (ride) {
    if (ride.status !== RideStatus.REQUESTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Ride already accepted or not available"
      );
    }
  }

  ride.status = RideStatus.ACCEPTED;
  ride.driver = new Types.ObjectId(driverId);
  ride.timestamps.acceptedAt = new Date();
  await ride.save();
  return ride;
};

const rejectRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  if (ride) {
    if (ride.status !== RideStatus.REQUESTED) {
      throw new AppError(httpStatus.BAD_REQUEST, "'Ride cannot be rejected'");
    }
  }

  ride.status = RideStatus.REJECTED;
  ride.timestamps.rejectedAt = new Date();
  return await ride.save();
};

export const DriverService = { acceptRide, rejectRide };
