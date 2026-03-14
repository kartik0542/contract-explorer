import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Contract name is required"],
      trim: true,
    },
    contractType: {
      type: String,
      required: [true, "Contract type is required"],
      enum: ["SOW", "Master Agreement", "Amendment", "Service Agreement"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Processed", "Pending", "Rejected"], // allowed values
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Contract", ContractSchema);
