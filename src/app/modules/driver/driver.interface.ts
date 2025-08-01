import { Types } from "mongoose";
import { IVehicle } from "../vehicle/vehicle.interface";

export enum ApprovedStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  UN_AVAILABLE = "UN_AVAILABLE",
}

export interface ILocation {
  location: string;
  lat: number;
  lng: number;
}

export interface IDriver {
  user: Types.ObjectId;
  isAvailable: AvailabilityStatus;
  isApprovedStatus: ApprovedStatus;
  currentLocation: ILocation;
  vehicle: IVehicle;
}
