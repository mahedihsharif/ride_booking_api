import { z } from "zod";
import { PaymentMethodStatus } from "./ride.interface";

export const createRideZodSchema = z.object({
  pickupLocation: z.object({
    address: z.string({ invalid_type_error: "Address must be string" }),
  }),
  destinationLocation: z.object({
    address: z.string({ invalid_type_error: "Address must be string" }),
  }),
  paymentMethod: z.enum(
    [
      PaymentMethodStatus.CASH,
      PaymentMethodStatus.BKASH,
      PaymentMethodStatus.NAGAD,
    ],
    {
      required_error: "Payment is required",
      invalid_type_error: "Payment must be either CASH or BKASH or NAGAD",
    }
  ),
});
