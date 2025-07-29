import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  isBlocked?: boolean;
  isApproved?: boolean; // Only for driver
  isAvailable?: boolean; // Only for driver
}
