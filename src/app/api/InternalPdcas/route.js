import InternalPdca, { connectDB } from "@/app/models/InternalPdca";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

async function parseFormData(req) {
  const formData = await req.formData();
  const data = {};
  const fileUrls = [];
  const originalFileNames = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0 && key.startsWith("filepdf")) {
      const buffer = Buffer.from(await value.arrayBuffer());
      const filename = `${Date.now()}-${value.name.replaceAll(" ", "_")}`;
      const { url } = await put(filename, buffer, { access: "public" });
      fileUrls.push(url);
      originalFileNames.push(value.name);
    } else {
      data[key] = value;
    }
  }

  data.fileUrl = fileUrls;
  data.originalFileName = originalFileNames;

  if (data.existingAttachments) {
    try {
      const existing = JSON.parse(data.existingAttachments);
      if (Array.isArray(existing)) {
        existing.forEach(att => {
          data.fileUrl.push(att.fileUrl);
          data.originalFileName.push(att.originalFileName);
        });
      }
    } catch (e) {}
    delete data.existingAttachments;
  }

  return data;
}

export async function GET() {
  try {
    await connectDB();
    const pdcas = await InternalPdca.find().sort({ createdAt: -1 });
    return NextResponse.json({ pdcas }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await parseFormData(req);
    const newPdca = await InternalPdca.create(data);
    return NextResponse.json({ message: "Success", pdca: newPdca }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
