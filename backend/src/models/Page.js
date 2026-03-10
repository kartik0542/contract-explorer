import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      default: "Dashboard",
    },
    rank: {
      type: Number,
      default: 0,
    },
    parent: {
      type: String,
      default: null,
    },
    filters: {
      type: Object,
      default: {}, // example: { contractType: ["SOW"] }
    },
  },
  { timestamps: true },
);

export default mongoose.model("Page", PageSchema);
