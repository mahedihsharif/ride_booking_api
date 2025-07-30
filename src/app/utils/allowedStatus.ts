import { RideStatus } from "../modules/ride/ride.interface";

export const allowedStatuses = [
  RideStatus.PICKED_UP,
  RideStatus.IN_TRANSIT,
  RideStatus.COMPLETED,
] as const;

export type PartialRideStatus = (typeof allowedStatuses)[number];
