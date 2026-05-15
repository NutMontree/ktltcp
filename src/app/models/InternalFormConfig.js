import mongoose from "mongoose";

const InternalFormConfigSchema = new mongoose.Schema({
  type: { type: String, default: "internal_pdca_form", unique: true },
  pdcaItems: [
    {
      id: Number,
      label: String,
    },
  ],
  departments: [String],
  fiscalYears: [String],
});

export default mongoose.models.InternalFormConfig || mongoose.model("InternalFormConfig", InternalFormConfigSchema);
