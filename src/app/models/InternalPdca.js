import mongoose from "mongoose";

// Connection logic
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const InternalPdcaSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    department: { type: String, required: true },
    namework: { type: String, required: true },
    nameproject: { type: String, required: true },
    pdcaLink: { type: String },
    fileUrl: [{ type: String }],
    originalFileName: [{ type: String }],
    // Steps 1-11
    id1: String, id2: String, id3: String, id4: String, id5: String,
    id6: String, id7: String, id8: String, id9: String, id10: String, id11: String,
    id12: String, id13: String, id14: String, id15: String, id16: String, id17: String,
    id18: String, id19: String, id20: String, id21: String, id22: String, id23: String,
    id24: String, id25: String, id26: String, id27: String, id28: String, id29: String, id30: String
  },
  { timestamps: true }
);

const InternalPdca = mongoose.models.InternalPdca || mongoose.model("InternalPdca", InternalPdcaSchema);

export { connectDB };
export default InternalPdca;
