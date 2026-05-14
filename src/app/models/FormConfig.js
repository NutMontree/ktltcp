import mongoose, { Schema } from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable");
} else if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected (FormConfig)"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const FormConfigSchema = new Schema(
  {
    type: { type: String, default: "pdca_form", unique: true },
    pdcaItems: [
      {
        id: Number,
        label: String,
      }
    ],
    departments: [String],
    fiscalYears: { type: [String], default: ["2567", "2568", "2569", "2570"] },
  },
  {
    timestamps: true,
  }
);

const FormConfig = mongoose.models.FormConfig || mongoose.model("FormConfig", FormConfigSchema);

export default FormConfig;
