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

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const pdca = await InternalPdca.findById(id);
    return NextResponse.json({ pdca }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await parseFormData(req);
    const updated = await InternalPdca.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ message: "Updated", pdca: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await InternalPdca.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
