import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const DevdepartmentSchema = new Schema(
  {
    department: String,
    namework: String,
    nameproject: String,
    id1: String,
    id2: String,
    id3: String,
    id4: String,
    id5: String,
    id6: String,
    id7: String,
    id8: String,
    id9: String,
    id10: String,
    id11: String,
    id12: String,
    id13: String,
    id14: String,
    id15: String,
    id16: String,
    id17: String,
    id18: String,
    id19: String,
    id20: String,
  },
  {
    timestamps: true,
  }
);

const Devdepartment = mongoose.models.Devdepartment || mongoose.model("Devdepartment", DevdepartmentSchema);

export default Devdepartment;
