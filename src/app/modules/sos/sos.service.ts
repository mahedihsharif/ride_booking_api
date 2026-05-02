import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Ride } from "../ride/ride.model";
import { twilioService } from "../SMS/sms.service";
import { envVars } from "../../config/env";

const sendSOS = async (userId: string, rideId: string, message: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  const isAdminOrRiderOrDriver =
    ride.rider.toString() === userId ||
    ride.driver?.toString() === userId;

  if (!isAdminOrRiderOrDriver) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to send SOS for this ride"
    );
  }

  const adminWhatsAppNumber = envVars.TWILIO_WHATSAPP_NUMBER;
  if (!adminWhatsAppNumber) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Admin WhatsApp number not configured"
    );
  }

  const sosMessage = `🚨 SOS ALERT 🚨\n\nRide ID: ${rideId}\nUser ID: ${userId}\nMessage: ${message}\n\nPlease take immediate action!`;

  const msg = await twilioService.sendWhatsApp(
    adminWhatsAppNumber,
    sosMessage
  );

  return {
    success: true,
    sid: msg.sid,
    message: "SOS sent successfully via WhatsApp",
  };
};

export const SOSService = {
  sendSOS,
};
