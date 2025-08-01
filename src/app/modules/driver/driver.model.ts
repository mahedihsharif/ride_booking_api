import { Schema, model } from "mongoose";
import { ApprovedStatus } from "./driver.interface";

const driverSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: false },
    isApprovedStatus: {
      type: String,
      enum: Object.keys(ApprovedStatus),
      default: ApprovedStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Driver = model("Driver", driverSchema);
