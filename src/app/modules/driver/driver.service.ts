import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { allowedStatuses, PartialRideStatus } from "../../utils/allowedStatus";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { ActiveStatus, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { ApprovedStatus, AvailabilityStatus } from "./driver.interface";
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

  const driver = await Driver.findOne({ user: driverId });

  if (
    driver?.isApprovedStatus === ApprovedStatus.APPROVED &&
    driver.isAvailable === AvailabilityStatus.AVAILABLE
  ) {
    ride.status = RideStatus.ACCEPTED;
    ride.driver = new Types.ObjectId(driverId);
    ride.history.push({
      status: RideStatus.ACCEPTED,
      timestamp: new Date(),
    });
    driver.isAvailable = AvailabilityStatus.UN_AVAILABLE;
    await driver.save();
    await ride.save();
    return ride;
  }
  throw new AppError(
    httpStatus.NOT_ACCEPTABLE,
    driver?.isApprovedStatus !== ApprovedStatus.APPROVED
      ? `Your status is ${driver?.isApprovedStatus}`
      : "You are not available to accept the ride"
  );
};

const rejectRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  if (ride) {
    if (ride.status !== RideStatus.REQUESTED) {
      throw new AppError(httpStatus.BAD_REQUEST, "'Ride cannot be rejected'");
    }
  }
  const user = await User.findById(driverId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isActive === ActiveStatus.BLOCKED)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your are temporary Blocked by unnecessary REJECT attempts, please contact with admin"
    );

  const driver = await Driver.findOne({ user: driverId });
  if (driver?.isApprovedStatus !== ApprovedStatus.APPROVED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `You are not able to REJECT a Ride, you are ${driver?.isApprovedStatus} driver`
    );
  }

  const now = new Date();
  const today = now.toDateString();
  const lastCancel = user.lastCancelDate?.toDateString();
  // reset counter if it's a new day
  if (lastCancel !== today) {
    user.cancelAttempts = 1;
    user.lastCancelDate = now;
  } else {
    if (user.cancelAttempts) {
      user.cancelAttempts += 1;
    }
  }

  // block user if cancel limit exceeds
  if (user.cancelAttempts && user.cancelAttempts > 3) {
    user.isActive = ActiveStatus.BLOCKED;
  }
  await user.save();

  ride.status = RideStatus.REJECTED;
  ride.history.push({
    status: RideStatus.REJECTED,
    timestamp: new Date(),
  });
  driver.isAvailable = AvailabilityStatus.AVAILABLE;
  await driver.save();
  await ride.save();
  return ride;
};

const updateStatus = async (
  rideId: string,
  driverId: string,
  status: PartialRideStatus
) => {
  const driverObjId = new Types.ObjectId(driverId);
  const ride = await Ride.findOne({ _id: rideId, driver: driverObjId });
  const driver = await Driver.findOne({ user: driverId });

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
  if (status === RideStatus.PICKED_UP) {
    ride.history.push({ status: RideStatus.PICKED_UP, timestamp: now });
    if (driver) {
      driver.isAvailable = AvailabilityStatus.UN_AVAILABLE;
      await driver.save();
    }
  }

  if (status === RideStatus.IN_TRANSIT) {
    ride.history.push({ status: RideStatus.IN_TRANSIT, timestamp: now });
    if (driver) {
      driver.isAvailable = AvailabilityStatus.UN_AVAILABLE;
      await driver.save();
    }
  }

  if (status === RideStatus.COMPLETED) {
    ride.history.push({ status: RideStatus.COMPLETED, timestamp: now });
    if (driver) {
      driver.isAvailable = AvailabilityStatus.AVAILABLE;
      await driver.save();
    }
  }

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

const setAvailability = async (driverId: string) => {
  const driver = await Driver.findOne({ user: driverId });
  if (!driver) throw new AppError(httpStatus.NOT_FOUND, "Driver not found");

  driver.isAvailable = AvailabilityStatus.AVAILABLE;
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

const availableDriver = async () => {
  const drivers = await Driver.find({
    isApprovedStatus: ApprovedStatus.APPROVED,
    isAvailable: true,
  });
  if (drivers.length < 1)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No Drivers Available now, please wait a while minute"
    );

  return drivers;
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
  availableDriver,
};
