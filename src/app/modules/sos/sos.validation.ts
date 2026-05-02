import { z } from "zod";

export const sendSOSZodSchema = z.object({
  message: z.string({ required_error: "Message is required" }).min(1, "Message cannot be empty"),
  rideId: z.string({ required_error: "Ride ID is required" }),
});
