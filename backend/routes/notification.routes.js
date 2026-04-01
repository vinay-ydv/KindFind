import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getUserNotifications, markAsRead } from "../controllers/notification.controllers.js";

const notificationRouter = express.Router();

notificationRouter.use(isAuth);
notificationRouter.get("/", getUserNotifications);
notificationRouter.put("/:id/read", markAsRead);

export default notificationRouter;