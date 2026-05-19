import mongoose from "mongoose";

const CommitteeMemberSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  position: { type: String, default: "" }, // e.g. ประธานกรรมการ, กรรมการ
});

const CommitteeGroupSchema = new mongoose.Schema({
  groupName: { type: String, default: "" }, // e.g. คณะกรรมการฝ่ายอำนวยการ, คณะกรรมการฝ่ายจัดเตรียมสถานที่
  members: { type: [CommitteeMemberSchema], default: [] }
});

const InternalStep5Schema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "InternalPdca", required: true },
  orderNumber: { type: String, default: "" }, // คำสั่งที่
  subject: { type: String, default: "แต่งตั้งคณะกรรมการดำเนินงาน" }, // เรื่อง
  projectName: { type: String, default: "" }, // ชื่อโครงการ
  rationale: { type: String, default: "" }, // ความเป็นมา/เนื้อหาของคำสั่ง
  
  // Committee Groups
  committeeGroups: { type: [CommitteeGroupSchema], default: [] },
  
  // Signer
  signerName: { type: String, default: "นางสาวทักษิณา ชมจันทร์" },
  signerPosition: { type: String, default: "ผู้อำนวยการวิทยาลัยเทคนิคกันทรลักษ์" },
  orderDate: { type: String, default: "" }, // สั่ง ณ วันที่
  
}, { timestamps: true });

export default mongoose.models.InternalStep5 || mongoose.model("InternalStep5", InternalStep5Schema);
