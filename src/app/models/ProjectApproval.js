import mongoose from "mongoose";

const ProjectApprovalSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "InternalPdca", required: true },
  title: String,
  rationale: String,
  objectives: [String],
  targets: {
    quantity: String,
    quality: String
  },
  steps: [
    {
      activity: String,
      period: String
    }
  ],
  budget: [
    {
      item: String,
      amount: Number
    }
  ],
  expectedOutcomes: [String],
  responsiblePerson: String,
}, { timestamps: true });

export default mongoose.models.ProjectApproval || mongoose.model("ProjectApproval", ProjectApprovalSchema);
