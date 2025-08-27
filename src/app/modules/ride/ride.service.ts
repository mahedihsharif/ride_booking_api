import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { getCoordinatesFromAddress } from "../../utils/getCoordinates";
import { Driver } from "../driver/driver.model";
import { ActiveStatus, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IRide, IRidesQueryFilters, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

const requestRide = async (riderId: string, payload: IRide) => {
  const pickupAddress = payload.pickupLocation.address;
  const destinationAddress = payload.destinationLocation.address;
  const pickupCoords = await getCoordinatesFromAddress(pickupAddress);
  const destinationCoords = await getCoordinatesFromAddress(destinationAddress);

  const newRiderData = {
    rider: riderId,
    pickupLocation: {
      address: pickupAddress,
      lat: pickupCoords?.lat,
      lng: pickupCoords?.lng,
    },
    destinationLocation: {
      address: destinationAddress,
      lat: destinationCoords?.lat,
      lng: destinationCoords?.lng,
    },
    paymentMethod: payload.paymentMethod,
  };
  const ride = await Ride.create(newRiderData);
  return ride;
};

const getRiderAllRides = async (
  riderId: string,
  limit: number,
  skip: number,
  filters?: {
    status?: string;
    fareMin?: number;
    fareMax?: number;
    dateFrom?: string;
    dateTo?: string;
  }
) => {
  const query: any = { rider: riderId };

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.fareMin !== undefined || filters?.fareMax !== undefined) {
    query.fare = {};
    if (filters.fareMin !== undefined) query.fare.$gte = filters.fareMin;
    if (filters.fareMax !== undefined) query.fare.$lte = filters.fareMax;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
  }

  const rides = await Ride.find(query)
    .populate("rider", "name email")
    .populate("driver", "name email")
    .skip(skip)
    .limit(limit);
  const totalRides = await Ride.countDocuments(query);
  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};
const getDriverAllRides = async (
  driverId: string,
  limit: number,
  skip: number,
  filters?: {
    status?: string;
    fareMin?: number;
    fareMax?: number;
    dateFrom?: string;
    dateTo?: string;
  }
) => {
  const query: any = {
    driver: { $exists: true },
    rider: { $exists: true, $ne: null },
  };

  if (driverId) query.driver = driverId;

  if (filters?.status) query.status = filters.status;

  if (filters?.fareMin !== undefined || filters?.fareMax !== undefined) {
    query.fare = {};
    if (filters.fareMin !== undefined) query.fare.$gte = filters.fareMin;
    if (filters.fareMax !== undefined) query.fare.$lte = filters.fareMax;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
  }

  const rides = await Ride.find(query)
    .populate("rider", "name email")
    .populate("driver", "name email")
    .skip(skip)
    .limit(limit);

  if (!rides.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No rides found with assigned driver"
    );
  }

  const totalRides = await Ride.countDocuments(query);

  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};
const getRiderSingleRide = async (rideId: string, decodedToken: JwtPayload) => {
  const riderId = decodedToken.userId;
  const ride = await Ride.findOne({ _id: rideId, rider: riderId })
    .populate("rider", "name email")
    .populate("driver", "name email");

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride doesn't found!");
  }

  const isSelf = riderId === ride.rider._id.toString();

  if (!isSelf) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to view other user rides"
      );
    }
  }

  return ride;
};

const cancelRide = async (rideId: string, userId: string) => {
  const ride = await Ride.findOne({ _id: rideId, rider: userId });
  if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  if (ride) {
    if (ride.status !== RideStatus.REQUESTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot cancel this ride now, because ride status is ${ride.status}`
      );
    }
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  if (user.isActive === ActiveStatus.BLOCKED)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your are temporary Blocked by unnecessary cancel attempts"
    );

  // Calculate time difference in minutes
  const requestedAt = ride.history.find(
    (entry) => entry.status === RideStatus.REQUESTED
  );

  if (!requestedAt?.timestamp) throw new Error("Requested time missing");

  const now = new Date();
  const diffMs = now.getTime() - requestedAt?.timestamp.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  const CANCEL_WINDOW = Number(envVars.CANCEL_WINDOW_TIME) || 2;

  if (diffMinutes > CANCEL_WINDOW) {
    throw new Error(
      `You can cancel only within ${CANCEL_WINDOW} minutes of requesting`
    );
  }

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
  ride.status = RideStatus.CANCELLED;
  ride.history.push({
    status: RideStatus.CANCELLED,
    timestamp: new Date(),
  });
  await ride.save();
  return ride;
};

const getAllRides = async (filters: IRidesQueryFilters) => {
  const {
    page = 1,
    limit = 10,
    status,
    driver,
    rider,
    startDate,
    endDate,
  } = filters;

  const match: any = {};

  // status filter
  if (status) {
    match.status = status;
  }

  // date range filter
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const pipeline: any[] = [
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "driver",
        foreignField: "_id",
        as: "driver",
      },
    },
    { $unwind: { path: "$driver", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "rider",
        foreignField: "_id",
        as: "rider",
      },
    },
    { $unwind: { path: "$rider", preserveNullAndEmptyArrays: true } },
  ];

  // driver name filter
  if (driver) {
    pipeline.push({
      $match: {
        "driver.name": { $regex: driver, $options: "i" },
      },
    });
  }

  // rider name filter
  if (rider) {
    pipeline.push({
      $match: {
        "rider.name": { $regex: rider, $options: "i" },
      },
    });
  }

  // sort & pagination
  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // project only required fields
  pipeline.push({
    $project: {
      _id: 1,
      pickupLocation: 1,
      destinationLocation: 1,
      paymentMethod: 1,
      status: 1,
      fare: 1,
      createdAt: 1,
      "driver._id": 1,
      "driver.name": 1,
      "rider._id": 1,
      "rider.name": 1,
    },
  });

  const rides = await Ride.aggregate(pipeline);

  // total count (without pagination)
  const countPipeline = [...pipeline];
  countPipeline.splice(countPipeline.length - 3, 3); // remove sort, skip, limit
  countPipeline.push({ $count: "total" });

  const totalResult = await Ride.aggregate(countPipeline);
  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  return {
    data: rides,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllRidesHistory = async () => {
  const rides = await Ride.find()
    .select("rider driver status fare history")
    .populate("rider", "name email phone")
    .populate("driver", "name email phone");
  const totalRides = await Ride.countDocuments();
  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};

const ridesAvailable = async (driverId: string) => {
  const availableDriver = await Driver.findOne({ user: driverId });
  if (!availableDriver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not Found");
  }
  if (!availableDriver.isAvailable) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Your status is not available now"
    );
  }
  const rides = await Ride.find({ status: RideStatus.REQUESTED }).populate(
    "rider",
    "name"
  );

  if (rides.length < 1) {
    throw new AppError(httpStatus.NOT_FOUND, "Rides is not available now");
  }

  return rides;
};
const getSingleRide = async (driverId: string, rideId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,
    driver: driverId,
  })
    .populate("rider", "name")
    .populate("driver", "name");

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  return ride;
};
const activeRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,
    rider: riderId,
    status: {
      $in: [
        RideStatus.REQUESTED,
        RideStatus.ACCEPTED,
        RideStatus.CANCELLED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
      ],
    },
  })
    .populate("rider", "name")
    .populate("driver", "name");

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  return ride;
};
const getAllCompletedRides = async (driverId: string) => {
  const rides = await Ride.find({
    driver: driverId,
    status: RideStatus.COMPLETED,
  });
  const totalRides = await Ride.countDocuments({
    driver: driverId,
    status: RideStatus.COMPLETED,
  });

  if (rides.length < 1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rides is not found with Completed History"
    );
  }

  return {
    data: rides,
    meta: {
      total: totalRides,
    },
  };
};

export const RideService = {
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
