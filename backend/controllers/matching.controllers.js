// Add this below your existing createReport function

import Report from "../models/report.model.js";

export const getReportById = async (req, res) => {
//   console.log(`=== [GET /report/${req.params.id}] Fetching specific report ===`);
  
  try {
    const { id } = req.params;

    // Fetch the report and populate the author's basic info
    // This sends the entire user document (I recommend adding "-password" so you don't accidentally send the user's password hash to the frontend!)
const report = await Report.findById(id).populate("author", "-password");

    if (!report) {
      console.warn("[getReportById] Report not found for ID:", id);
      return res.status(404).json({ message: "Report not found" });
    }

    // console.log("[getReportById] Successfully fetched report:", report.title);
    return res.status(200).json({ report });
    
  } catch (error) {
    console.error("[getReportById] Error:", error);
    // Handle invalid MongoDB ObjectId format errors gracefully
    if (error.kind === 'ObjectId') {
       return res.status(400).json({ message: "Invalid report ID format" });
    }
    return res.status(500).json({ 
      message: "Failed to fetch report", 
      error: error.message 
    });
  }
};