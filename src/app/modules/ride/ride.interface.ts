import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export interface ILocation {
  address: string;
  lat: number;
  lng: number;
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  fare: number;
  status: RideStatus;
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    rejectedAt?: Date;
    inTransitAt?: Date;
  };
}
