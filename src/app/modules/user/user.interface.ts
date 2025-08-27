import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum ActiveStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  isActive?: ActiveStatus;
  cancelAttempts?: number;
  lastCancelDate?: Date;
  driver?: Types.ObjectId;
}
