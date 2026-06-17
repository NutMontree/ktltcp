const fs = require('fs');
const path = require('path');

const steps = [
  { id: 9, type: 'memo', title: 'ขอรายงานการประชุม' },
  { id: 10, type: 'memo', title: 'ขอความอนุเคราะห์ประชาสัมพันธ์โครงการ' },
  { id: 11, type: 'memo', title: 'รายงานการประชาสัมพันธ์โครงการ' },
  { id: 12, type: 'generic', title: 'กำหนดการจัดกิจกรรม' },
  { id: 13, type: 'generic', title: 'หนังสือเชิญ/ตอบรับ/ขอบคุณวิทยากร' },
  { id: 14, type: 'generic', title: 'ลายมือชื่อผู้เข้าร่วมโครงการ' },
  { id: 15, type: 'generic', title: 'รูปภาพการดำเนินงานโครงการ' },
  { id: 16, type: 'memo', title: 'รายงานสรุปการใช้งบประมาณ' },
  { id: 17, type: 'generic', title: 'เอกสารชุดเบิกโครงการ' },
  { id: 18, type: 'generic', title: 'แบบสอบถามประเมินความพึงพอใจ' },
  { id: 19, type: 'memo', title: 'รายงานสรุปผลการวิเคราะห์ข้อมูลการดำเนินโครงการ' },
  { id: 20, type: 'generic', title: 'ผลการวิเคราะห์ข้อมูล' },
  { id: 21, type: 'memo', title: 'รายงานสรุปผลการดำเนินโครงการ' },
];

const modelsDir = path.join(__dirname, 'src/app/models');
const apiBaseDir = path.join(__dirname, 'src/app/api/InternalPdcas/[id]');
const componentsDir = path.join(__dirname, 'src/app/(components)');
const pagesBaseDir = path.join(__dirname, 'src/app/InternalPdcaPage/[id]');

function generateModel(step) {
  const modelName = `InternalStep${step.id}`;
  let content = '';
  if (step.type === 'memo') {
    content = `import mongoose from "mongoose";

const ${modelName}Schema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "InternalPdca", required: true },
  docNumber: String,
  date: String,
  subject: { type: String, default: "${step.title}" },
  salutation: { type: String, default: "ผู้อำนวยการวิทยาลัยเทคนิคกันทรลักษ์" },
  paragraphs: { type: [String], default: [] },
  introPrefix: { type: String, default: "ในการนี้" },
  departmentName: String,
  additionalIntroText: { type: String, default: "" },
  projectName: String,
  signerName: String,
  signerPosition: { type: String, default: "หัวหน้างาน/หัวหน้าแผนก" },
  deputy2Name: String,
  deputy2Position: { type: String, default: "รองผู้อำนวยการฝ่ายแผนงานและความร่วมมือ" },
  deputy2Comment: String,
  directorName: String,
  directorPosition: { type: String, default: "ผู้อำนวยการวิทยาลัยเทคนิคกันทรลักษ์" },
  directorComment: String,
  footerText: { type: String, default: "“เรียนดี มีคุณธรรม”" },
}, { timestamps: true });

export default mongoose.models.${modelName} || mongoose.model("${modelName}", ${modelName}Schema);
`;
  } else {
    content = `import mongoose from "mongoose";

const ${modelName}Schema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "InternalPdca", required: true },
  content: String,
  fileUrl: [{ type: String }],
  originalFileName: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.${modelName} || mongoose.model("${modelName}", ${modelName}Schema);
`;
  }
  fs.writeFileSync(path.join(modelsDir, `${modelName}.js`), content);
}

function generateApiRoute(step) {
  const dir = path.join(apiBaseDir, `step${step.id}`);
  fs.mkdirSync(dir, { recursive: true });
  const modelName = `InternalStep${step.id}`;
  
  const content = `import ${modelName} from "@/app/models/${modelName}";
import { connectDB } from "@/app/models/InternalPdca";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await ${modelName}.findOne({ projectId: id });
    return NextResponse.json({ data: data || {} }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const data = await ${modelName}.findOneAndUpdate(
      { projectId: id },
      { ...body, projectId: id },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Success", data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
`;
  fs.writeFileSync(path.join(dir, 'route.js'), content);
}

function generateComponent(step) {
  const componentName = `InternalStep${step.id}Form`;
  const memoTemplatePath = path.join(componentsDir, 'InternalInviteMemoForm.jsx');
  let content = '';

  if (step.type === 'memo') {
    content = fs.readFileSync(memoTemplatePath, 'utf-8');
    content = content.replace(/InternalInviteMemoForm/g, componentName);
    content = content.replace(/ขอเชิญประชุม/g, step.title);
    content = content.replace(/\/step8`/g, `/step${step.id}\``);
    content = content.replace(/\(Step 8\)/g, `(Step ${step.id})`);
  } else {
    // Generic form component
    content = `"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ${componentName} = ({ projectId, initialData = {} }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    content: initialData.content || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/InternalPdcas/' + projectId + '/step' + step.id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "บันทึกข้อมูลสำเร็จ!" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการบันทึก" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-stroke bg-white p-8 shadow-xl dark:bg-boxdark">
      <div className="mb-8 flex items-center justify-between border-b pb-6">
        <h2 className="text-2xl font-black text-primary">
          ${step.title}
        </h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-xl bg-primary px-8 py-2 font-bold text-white"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล (Step ${step.id})"}
        </button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-bold">ข้อมูลเพิ่มเติม / แนบลิงก์</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-2xl border bg-gray-50 p-4"
            placeholder="กรอกรายละเอียด หรือวางลิงก์ไฟล์งาน..."
          />
        </div>
      </div>
      {message && (
        <div className={"fixed bottom-10 right-10 z-[9999] animate-bounce rounded-2xl px-8 py-4 font-bold shadow-2xl " + (message.type === "success" ? "bg-success text-white" : "bg-danger text-white")}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ${componentName};
`;
  }
  fs.writeFileSync(path.join(componentsDir, `${componentName}.jsx`), content);
}

function generatePage(step) {
  const dir = path.join(pagesBaseDir, `step${step.id}`);
  fs.mkdirSync(dir, { recursive: true });
  
  const componentName = `InternalStep${step.id}Form`;
  const modelName = `InternalStep${step.id}`;
  
  const content = `import ${componentName} from "@/app/(components)/${componentName}";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ${modelName} from "@/app/models/${modelName}";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await ${modelName}.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step${step.id}Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="${step.title} (Step ${step.id})" />
      <div className="mx-auto max-w-5xl">
        <${componentName} projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step${step.id}Page;
`;
  fs.writeFileSync(path.join(dir, 'page.jsx'), content);
}

steps.forEach(step => {
  console.log("Generating Step " + step.id + ": " + step.title);
  generateModel(step);
  generateApiRoute(step);
  generateComponent(step);
  generatePage(step);
});

console.log('All 13 forms generated successfully!');
