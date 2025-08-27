import { Schema, model } from "mongoose";
import { envVars } from "../../config/env";
import { calculateDistanceInKm } from "../../utils/calculateDistanceInKm";
import { getCoordinatesFromAddress } from "../../utils/getCoordinates";
import { IRide, PaymentMethodStatus, RideStatus } from "./ride.interface";

const locationSchema = {
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
};

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(RideStatus),
    },
    timestamp: Date,
  },
  { _id: false }
);

const rideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User" },

    pickupLocation: { type: locationSchema, required: true, _id: false },
    destinationLocation: { type: locationSchema, required: true, _id: false },
    paymentMethod: {
      type: String,
      enum: Object.keys(PaymentMethodStatus),
      required: true,
    },
    fare: { type: Number },

    status: {
      type: String,
      enum: Object.keys(RideStatus),
      default: RideStatus.REQUESTED,
    },
    history: [statusHistorySchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// by default history set
rideSchema.pre("save", function (next) {
  if (this.isNew && (!this.history || this.history.length === 0)) {
    this.history = [
      {
        status: this.status || RideStatus.REQUESTED,
        timestamp: new Date(),
      },
    ];
  }
  next();
});

//fare calculate
rideSchema.pre("save", async function (next) {
  try {
    const ride = this;

    if (
      !ride.fare &&
      ride.pickupLocation.address &&
      ride.destinationLocation.address
    ) {
      // Get pickup coordinates
      const pickupCoords = await getCoordinatesFromAddress(
        ride.pickupLocation.address
      );
      ride.pickupLocation.lat = pickupCoords.lat;
      ride.pickupLocation.lng = pickupCoords.lng;

      // Get destination coordinates
      const destinationCoords = await getCoordinatesFromAddress(
        ride.destinationLocation.address
      );
      ride.destinationLocation.lat = destinationCoords.lat;
      ride.destinationLocation.lng = destinationCoords.lng;

      // Calculate distance and fare
      const distanceKm = calculateDistanceInKm(pickupCoords, destinationCoords);
      const perKmRate = Number(envVars.PER_KM_RATE);
      ride.fare = Math.ceil(distanceKm * perKmRate);
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const Ride = model<IRide>("Ride", rideSchema);
