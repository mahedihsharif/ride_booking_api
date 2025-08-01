import { Types } from "mongoose";

export enum ApprovedStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IDriver {
  user: Types.ObjectId;
  isAvailable: boolean;
  isApprovedStatus: ApprovedStatus;
}
