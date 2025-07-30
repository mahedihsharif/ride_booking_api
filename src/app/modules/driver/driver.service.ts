import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { allowedStatuses, PartialRideStatus } from "../../utils/allowedStatus";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

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

const updateStatus = async (
  rideId: string,
  driverId: string,
  status: PartialRideStatus
) => {
  const driver = new Types.ObjectId(driverId);
  const ride = await Ride.findOne({ _id: rideId, driver: driver });

  if (!ride) throw new Error("Ride not found or not assigned to you");

  if (!allowedStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status update");
  }
  //sequential flow
  const currentStatus = ride.status;
  const validTransitions: Partial<Record<RideStatus, RideStatus>> = {
    [RideStatus.ACCEPTED]: RideStatus.PICKED_UP,
    [RideStatus.PICKED_UP]: RideStatus.IN_TRANSIT,
    [RideStatus.IN_TRANSIT]: RideStatus.COMPLETED,
  };

  if (validTransitions[currentStatus] !== status) {
    throw new Error(
      `You can't change status from ${currentStatus} to ${status}`
    );
  }

  // Set new status and timestamp
  ride.status = status;

  const now = new Date();
  if (status === RideStatus.PICKED_UP) ride.timestamps.pickedUpAt = now;
  if (status === RideStatus.IN_TRANSIT) ride.timestamps.inTransitAt = now;
  if (status === RideStatus.COMPLETED) ride.timestamps.completedAt = now;

  await ride.save();
  return ride;
};

const driverEarnings = async (driverId: string) => {
  const rides = await Ride.find({
    driver: driverId,
    status: RideStatus.COMPLETED,
  });

  if (!rides) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found for this driver");
  }

  const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return {
    rides,
    totalCompletedRides: rides.length,
    totalEarnings,
  };
};

const setAvailability = async (driverId: string, isAvailable: boolean) => {
  const user = await User.findById(driverId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (user.role !== Role.DRIVER)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only drivers can update availability"
    );

  user.isAvailable = isAvailable;
  await user.save();
  return user;
};

export const DriverService = {
  acceptRide,
  rejectRide,
  updateStatus,
  driverEarnings,
  setAvailability,
};
