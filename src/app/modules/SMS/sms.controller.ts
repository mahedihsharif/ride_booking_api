import { Request, Response } from "express";
import { twilioService } from "./sms.service";

export const sendSMSController = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    const msg = await twilioService.sendSMS(to, message);
    res.status(200).json({ success: true, sid: msg.sid });
  } catch (error: any) {
    console.error("SMS Error:", error);
    res
      .status(500)
      .json({ success: false, message: error?.message || "SMS failed" });
  }
};

export const sendWhatsAppController = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    const msg = await twilioService.sendWhatsApp(to, message);
    res.status(200).json({ success: true, sid: msg.sid });
  } catch (error: any) {
    console.error("WhatsApp Error:", error);
    res
      .status(500)
      .json({ success: false, message: error?.message || "WhatsApp failed" });
  }
};
