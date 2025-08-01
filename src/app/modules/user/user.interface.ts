import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum Blocked {
  BLOCKED = "BLOCKED",
  UN_BLOCKED = "UN_BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role;
  isBlocked?: Blocked;
  driver?: Types.ObjectId;
  // admin?: Types.ObjectId;
}
