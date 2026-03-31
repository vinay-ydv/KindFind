// Add this below your existing createReport function

import Report from "../models/report.model.js";

import { pipeline } from "@xenova/transformers";

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





// Initialize Gemini (Make sure to put your free API key in your .env file)


// Helper function to calculate Cosine Similarity between two arrays of numbers
function calculateCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const findMatches = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(`id is ${id}`)
    // 1. Get the source item the user just reported/clicked
    const sourceItem = await Report.findById(id).populate("author", "-password");
    if (!sourceItem) return res.status(404).json({ message: "Item not found" });

    // ==========================================
    // PHASE 1: THE DATABASE PRE-FILTER (Your Request)
    // ==========================================
    const oppositeType = sourceItem.reportType === "lost" ? "found" : "lost";
    
    // We ONLY pull items from the database that match the EXACT category, 
    // EXACT location, and the OPPOSITE report type.
    const candidateItems = await Report.find({
      reportType: oppositeType,
      category: sourceItem.category,
      location: sourceItem.location,
      _id: { $ne: sourceItem._id } // Don't match with itself
    }).populate("author", "-password");

    // If no items in the same city/category, we stop here. Saves AI compute!
    if (candidateItems.length === 0) {
      return res.status(200).json({ sourceItem, matches: [] });
    }

    // ==========================================
    // PHASE 2: GENERATE SOURCE EMBEDDING (The "Brain")
    
    // Combine the user's text with the Gemini tags (assuming you saved Gemini tags to sourceItem.aiTags when they created the report)
    const sourceTextToEmbed = `${sourceItem.title}. ${sourceItem.description}. Tags: ${sourceItem.aiTags || ""}`;
    
    // Load the free local HuggingFace model
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    // Convert text to numbers
    const sourceOutput = await extractor(sourceTextToEmbed, { pooling: 'mean', normalize: true });
    const sourceVector = Array.from(sourceOutput.data);

    // ==========================================
    // PHASE 3: COMPARE VECTORS (The Matchmaker)
    // ==========================================
    const scoredMatches = [];

    for (const candidate of candidateItems) {
      // Create the text to embed for the candidate
      const candidateText = `${candidate.title}. ${candidate.description}. Tags: ${candidate.aiTags || ""}`;
      
      // Convert candidate text to numbers
      const candidateOutput = await extractor(candidateText, { pooling: 'mean', normalize: true });
      const candidateVector = Array.from(candidateOutput.data);

      // Do the math! How similar are these two arrays of numbers? (Returns 0.0 to 1.0)
      const similarityScore = calculateCosineSimilarity(sourceVector, candidateVector);

      // Convert to a clean percentage (e.g., 85)
      const matchPercentage = Math.round(similarityScore * 100);

      // If it's mathematically similar enough (e.g., over 60% match), add it to results
      if (matchPercentage > 60) {
        // Convert Mongoose document to plain object to inject our custom match score
        const matchData = candidate.toObject();
        matchData.matchScore = matchPercentage; 
        scoredMatches.push(matchData);
      }
    }

    // Sort the matches so the highest percentage is at the top
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    return res.status(200).json({ 
      success: true, 
      sourceItem, 
      matches: scoredMatches 
    });

  } catch (error) {
    console.error("Match finding error:", error);
    return res.status(500).json({ message: "Failed to run matching engine" });
  }
};