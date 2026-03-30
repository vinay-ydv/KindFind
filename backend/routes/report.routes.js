import express from "express";
import upload from "../middleware/multer.js";
import { 
  createReport, 
  getAllReports, 
  getMyReports, 
  deleteReport, 
  updateReport 
} from "../controllers/report.controllers.js";
import isAuth from "../middleware/isAuth.js";

const reportRouter = express.Router();

reportRouter.post("/create", isAuth, upload.single("image"), createReport);

reportRouter.get("/all", isAuth, getAllReports); 

// NEW ROUTES
reportRouter.get("/my-reports", isAuth, getMyReports);
reportRouter.delete("/delete/:id", isAuth, deleteReport);
// Use multer here just in case they upload a new image while editing
reportRouter.put("/update/:id", isAuth, upload.single("image"), updateReport);



export default reportRouter;