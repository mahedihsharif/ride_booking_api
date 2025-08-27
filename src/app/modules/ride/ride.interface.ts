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
export enum PaymentMethodStatus {
  CASH = "CASH",
  BKASH = "BKASH",
  NAGAD = "NAGAD",
}
export interface ILocation {
  address: string;
  lat: number;
  lng: number;
}

export interface IStatusHistory {
  status: RideStatus;
  timestamp: Date;
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  paymentMethod: PaymentMethodStatus;
  fare: number;
  status: RideStatus;
  history: IStatusHistory[];
}

export interface IRidesQueryFilters {
  page?: number;
  limit?: number;
  status?: string;
  driver?: string;
  rider?: string;
  startDate?: string;
  endDate?: string;
}
