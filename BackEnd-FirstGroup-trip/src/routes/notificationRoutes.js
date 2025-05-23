import express from "express";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notification-settings", getNotificationSettings);
router.put("/notification-settings", updateNotificationSettings);

export default router;
