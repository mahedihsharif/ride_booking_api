import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { allowedStatuses, PartialRideStatus } from "../../utils/allowedStatus";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { ApprovedStatus } from "./driver.interface";
import { Driver } from "./driver.model";

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
  ride.history.push({
    status: RideStatus.ACCEPTED,
    timestamp: new Date(),
  });
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
  ride.history.push({
    status: RideStatus.REJECTED,
    timestamp: new Date(),
  });
  await ride.save();
  return ride;
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
  if (status === RideStatus.PICKED_UP)
    ride.history.push({ status: RideStatus.PICKED_UP, timestamp: now });
  if (status === RideStatus.IN_TRANSIT)
    ride.history.push({ status: RideStatus.IN_TRANSIT, timestamp: now });
  if (status === RideStatus.COMPLETED)
    ride.history.push({ status: RideStatus.COMPLETED, timestamp: now });

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
  const driver = await Driver.findOne({ user: driverId });
  if (!driver) throw new AppError(httpStatus.NOT_FOUND, "Driver not found");

  driver.isAvailable = isAvailable;
  await driver.save();
  return driver;
};

const getAllDrivers = async () => {
  const drivers = await User.find({ role: Role.DRIVER });
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  return {
    data: drivers,
    meta: {
      total: totalDrivers,
    },
  };
};

const approveDriver = async (driverId: string) => {
  const driver = await Driver.findOne({ user: driverId });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  if (driver.isApprovedStatus === ApprovedStatus.APPROVED) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Driver is already ${driver.isApprovedStatus}`
    );
  }
  driver.isApprovedStatus = ApprovedStatus.APPROVED;
  await driver.save();
  return driver;
};

const suspendDriver = async (driverId: string) => {
  const driver = await Driver.findOne({ user: driverId });
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  if (driver.isApprovedStatus === ApprovedStatus.SUSPENDED) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Driver is already ${driver.isApprovedStatus}`
    );
  }
  driver.isApprovedStatus = ApprovedStatus.SUSPENDED;
  await driver.save();
  return driver;
};

export const DriverService = {
  acceptRide,
  rejectRide,
  updateStatus,
  driverEarnings,
  setAvailability,
  getAllDrivers,
  approveDriver,
  suspendDriver,
};
