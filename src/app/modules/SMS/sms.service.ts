import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export const twilioService = {
  sendSMS: async (to: string, message: string) => {
    return client.messages.create({
      body: message,
      from: process.env.TWILIO_NUMBER!, // SMS-capable Twilio number
      to, // e.g. +8801XXXXXXXXX
    });
  },

  sendWhatsApp: async (to: string, message: string) => {
    return client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_SANDBOX_NUMBER!}`, // e.g. whatsapp:+14155238886
      to: `whatsapp:${to}`, // e.g. whatsapp:+8801XXXXXXXXX
    });
  },
};
