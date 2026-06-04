import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportType: {
    type: String,
    enum: ["lost", "found"], 
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true 
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Electronics", "Pets", "Wallets", "Keys", 
      "Jewelry", "Documents", "Bags", "Clothing", "Other"
    ]
  },
  date: {
    type: Date, 
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    default: "",
    required:true
  },
  aiTags: {
    type: String, 
    default: ""
  },
  matchStatus: {
    type: String,
    enum: ["searching", "resolved"],
    default: "searching"
  }
}, { timestamps: true }) 

const Report = mongoose.model("Report", reportSchema)
export default Report