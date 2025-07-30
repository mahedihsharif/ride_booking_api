import { z } from "zod";

export const createRideZodSchema = z.object({
  pickupLocation: z.object({
    address: z.string({ invalid_type_error: "Address must be string" }),
  }),
  destinationLocation: z.object({
    address: z.string({ invalid_type_error: "Address must be string" }),
  }),
});
