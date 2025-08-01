import { Schema } from "mongoose";
import { VehicleType } from "./vehicle.interface";

export const vehicleSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(VehicleType),
      default: VehicleType.BIKE,
    },
    model: {
      type: String,
      default: "Unknown",
      //   required: true,
    },
    licensePlate: {
      type: String,
      default: "N/A",
      //   required: true,
      //   unique: true,
    },
    color: {
      type: String,
      default: "N/A",
    },
  },
  { _id: false }
);
