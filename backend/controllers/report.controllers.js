import Report from "../models/report.model.js"; // Adjust if your file is named differently
import uploadOnCloudinary from "../config/cloudinary.js";

// 1. IMPORT THE NEW SDK
import { GoogleGenAI } from "@google/genai";

// 2. INITIALIZE THE NEW CLIENT (It automatically looks for process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({});

// Helper function to calculate Cosine Similarity for AI matching


// Create Report 
export const createReport = async (req, res) => {
  try {
    const { title, description, category, location, reportType, date } = req.body;

    if (!title || !description || !category || !location || !reportType || !date) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    let imageUrl = "";
    let generatedTags = "";

    if (req.file) {
      const filePath = req.file.path;
      
      try {
        imageUrl = await uploadOnCloudinary(filePath);
      } catch (cloudError) {
        console.error("[createReport] Cloudinary upload failed:", cloudError);
        return res.status(500).json({ message: "Image upload failed", error: cloudError.message });
      }

      if (imageUrl) {
        try {
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const mimeType = req.file.mimetype || "image/jpeg"; 

          const prompt = "Analyze this lost and found item. Give me a comma-separated list of its main color, brand (if visible), material, category, shape, and any distinct features. Return ONLY the comma-separated words.";

          // 3. USE THE NEW GEMINI 3 FLASH MODEL & SYNTAX
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              prompt,
              {
                inlineData: {
                  data: Buffer.from(imageBuffer).toString("base64"),
                  mimeType: mimeType
                }
              }
            ]
          });
          
          // 4. NEW WAY TO GET TEXT (No parenthesis)
          generatedTags = response.text.trim();
          console.log("[createReport] Gemini Ai Tags Generated:", generatedTags);

        } catch (aiError) {
          console.error("[createReport] Gemini Tagging Failed:", aiError);
        }
      }
    }

    const newReport = await Report.create({
      author: req.userId,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      reportType,
      date,
      image: imageUrl,
      aiTags: generatedTags 
    });

    return res.status(201).json({ message: "Report created successfully", report: newReport });
  } catch (error) {
    console.error("[createReport] Unhandled error:", error);
    return res.status(500).json({ message: "Failed to create report", error: error.message });
  }
};

// Fetch all reports from all users
export const getAllReports = async (req, res) => {
  
  try {
    // Find all reports, populate author details, and sort newest to oldest
    const reports = await Report.find()
      .populate("author", "-password")
      .sort({ createdAt: -1 });

    // console.log(`[getAllReports] Found ${reports.length} reports.`);
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