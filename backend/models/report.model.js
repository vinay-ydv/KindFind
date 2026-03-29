import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportType: {
    type: String,
    enum: ["lost", "found"], // Forces it to only be these two values
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true // Removes accidental whitespace at the beginning/end
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
    type: Date, // Mongoose will automatically convert your frontend 'YYYY-MM-DD' string into a proper Date object
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String, // This will store the Cloudinary/S3 URL when you upload images
    default: ""
  },
  matchStatus: {
    type: String,
    enum: ["searching", "resolved"], // Used for the profile page badges
    default: "searching"
  }
}, { timestamps: true }) // Automatically adds 'createdAt' and 'updatedAt' fields

const Report = mongoose.model("Report", reportSchema)
export default Report