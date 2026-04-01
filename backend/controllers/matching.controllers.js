import Report from "../models/report.model.js";
import Notification from "../models/notification.model.js"; // <-- Added Notification Model
import { pipeline } from "@xenova/transformers";

/////// NOT USED ////////
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the report and populate the author's basic info
    const report = await Report.findById(id).populate("author", "-password");

    if (!report) {
      console.warn("[getReportById] Report not found for ID:", id);
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({ report });
    
  } catch (error) {
    console.error("[getReportById] Error:", error);
    if (error.kind === 'ObjectId') {
       return res.status(400).json({ message: "Invalid report ID format" });
    }
    return res.status(500).json({ 
      message: "Failed to fetch report", 
      error: error.message 
    });
  }
};

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
    
    // 1. Get the source item the user just reported/clicked
    const sourceItem = await Report.findById(id).populate("author", "-password");
    if (!sourceItem) return res.status(404).json({ message: "Item not found" });

    // ==========================================
    // PHASE 1: THE DATABASE PRE-FILTER 
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

    // If no items in the same city/category, we stop here.
    if (candidateItems.length === 0) {
      return res.status(200).json({ sourceItem, matches: [] });
    }

    // ==========================================
    // PHASE 2: GENERATE SOURCE EMBEDDING 
    // ==========================================
    const sourceTextToEmbed = `${sourceItem.title}. ${sourceItem.description}. Tags: ${sourceItem.aiTags || ""}`;
    
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const sourceOutput = await extractor(sourceTextToEmbed, { pooling: 'mean', normalize: true });
    const sourceVector = Array.from(sourceOutput.data);

    // ==========================================
    // PHASE 3: COMPARE VECTORS (The Matchmaker)
    // ==========================================
    const scoredMatches = [];

    for (const candidate of candidateItems) {
      const candidateText = `${candidate.title}. ${candidate.description}. Tags: ${candidate.aiTags || ""}`;
      
      const candidateOutput = await extractor(candidateText, { pooling: 'mean', normalize: true });
      const candidateVector = Array.from(candidateOutput.data);

      const similarityScore = calculateCosineSimilarity(sourceVector, candidateVector);
      const matchPercentage = Math.round(similarityScore * 100);

      // If it's mathematically similar enough (e.g., over 60% match), add it to results
      if (matchPercentage > 60) {
        const matchData = candidate.toObject();
        matchData.matchScore = matchPercentage; 
        scoredMatches.push(matchData);
      }
    }

    // Sort the matches so the highest percentage is at the top
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    // ==========================================
    // PHASE 4: SEND REAL-TIME NOTIFICATIONS
    // ==========================================
    // Grab the socket instance from Express
    const io = req.app.get("io"); 

    const sourceAuthorId = sourceItem.author._id.toString();

    // Loop through the successful matches and notify the OTHER user
    for (const match of scoredMatches) {
      const matchAuthorId = match.author._id.toString();

      // Don't notify yourself
      if (matchAuthorId !== sourceAuthorId) {
        
        // 1. Save notification to Database
        const newNotif = await Notification.create({
          recipient: matchAuthorId,
          sender: sourceAuthorId,
          item: match._id, // The item they posted that got matched
          message: `AI Match Found! A new ${sourceItem.reportType} item looks like an ${match.matchScore}% match for your post.`
        });

        // 2. Send Real-Time Socket Event to the recipient
        if (io) {
          const populatedNotif = await newNotif.populate("item");
          io.emit(`new_notification_${matchAuthorId}`, populatedNotif);
        }
      }
    }

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