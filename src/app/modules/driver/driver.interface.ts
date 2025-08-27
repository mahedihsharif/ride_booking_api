import { Types } from "mongoose";
import { IVehicle } from "../vehicle/vehicle.interface";

export enum ApprovedStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface ILocation {
  location: string;
  lat: number;
  lng: number;
}

export interface IDriver {
  user: Types.ObjectId;
  isAvailable: boolean;
  isApprovedStatus: ApprovedStatus;
  currentLocation: ILocation;
  vehicle: IVehicle;
}

export interface IDriverQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?:
    | ApprovedStatus.PENDING
    | ApprovedStatus.APPROVED
    | ApprovedStatus.SUSPENDED;
}
