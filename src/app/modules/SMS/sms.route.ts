import express from "express";
import { sendSMSController, sendWhatsAppController } from "./sms.controller";

const router = express.Router();

router.post("/send-sms", sendSMSController);
router.post("/send-whatsapp", sendWhatsAppController);

export const SMSRoutes = router;
