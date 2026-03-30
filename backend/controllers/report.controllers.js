import Report from "../models/report.model.js"; // Adjust if your file is named differently
import uploadOnCloudinary from "../config/cloudinary.js";

export const createReport = async (req, res) => {
//   console.log("=== [POST /report/create] Incoming request ===");
//   console.log("Body:", req.body);
//   console.log("UserID from auth middleware:", req.userId);
//   console.log("File info:", req.file);

  try {
    const { title, description, category, location, reportType, date } = req.body;

    // Validate required fields based on your Mongoose Schema
    if (!title || !description || !category || !location || !reportType || !date) {
      console.warn("[createReport] Validation failed: Missing required fields");
      return res.status(400).json({ 
        message: "Please provide all required fields: title, description, category, location, reportType, and date" 
      });
    }

    let imageUrl = "";

    // Handle Image Upload if a file was provided
    if (req.file) {
      const filePath = req.file.path;
    //   console.log("[createReport] File received at path:", filePath);

      try {
        imageUrl = await uploadOnCloudinary(filePath);
        // console.log("[createReport] Image uploaded to Cloudinary:", imageUrl);
      } catch (cloudError) {
        console.error("[createReport] Cloudinary upload failed:", cloudError);
        return res.status(500).json({ 
          message: "Image upload failed",
          error: cloudError.message 
        });
      }
    } else {
      console.log("[createReport] No file found, creating text-only report");
    }

    // Create the Report in the database
    const newReport = await Report.create({
      author: req.userId, // Pulled from your isAuth middleware
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      reportType,
      date,
      image: imageUrl,
    });

    // console.log("[createReport] Report created successfully:", newReport._id);

    return res.status(201).json({ 
      message: "Report created successfully", 
      report: newReport // Your frontend depends on this to get the new ID!
    });

  } catch (error) {
    console.error("[createReport] Unhandled error:", error);
    console.error("[createReport] Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Failed to create report",
      error: error.message 
    });
  }
};

// Fetch all reports from all users
export const getAllReports = async (req, res) => {
  console.log("=== [GET /report/all] Fetching all reports ===");
  try {
    // Find all reports, populate author details, and sort newest to oldest
    const reports = await Report.find()
      .populate("author", "-password")
      .sort({ createdAt: -1 });

    console.log(`[getAllReports] Found ${reports.length} reports.`);
    return res.status(200).json({ reports });
  } catch (error) {
    console.error("[getAllReports] Error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch reports", 
      error: error.message 
    });
  }
};


// Fetch ONLY the logged-in user's reports
export const getMyReports = async (req, res) => {
  console.log("=== [GET /report/my-reports] Fetching user reports ===");
  try {
    const reports = await Report.find({ author: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error("[getMyReports] Error:", error);
    return res.status(500).json({ message: "Failed to fetch your reports", error: error.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  console.log(`=== [DELETE /report/delete/${req.params.id}] ===`);
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Security Check: Make sure the logged-in user actually owns this report
    if (report.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this report" });
    }

    await Report.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("[deleteReport] Error:", error);
    return res.status(500).json({ message: "Failed to delete report", error: error.message });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  console.log(`=== [PUT /report/update/${req.params.id}] ===`);
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) return res.status(404).json({ message: "Report not found" });
    
    // Security Check
    if (report.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this report" });
    }

    const { title, description, category, location, reportType, date } = req.body;
    let imageUrl = report.image; // Keep existing image by default

    // If a new image was uploaded, process it
    if (req.file) {
      const filePath = req.file.path;
      imageUrl = await uploadOnCloudinary(filePath); // Assuming you still have this imported
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { title, description, category, location, reportType, date, image: imageUrl },
      { new: true } // Returns the updated document
    );

    return res.status(200).json({ message: "Report updated", report: updatedReport });
  } catch (error) {
    console.error("[updateReport] Error:", error);
    return res.status(500).json({ message: "Failed to update report", error: error.message });
  }
};