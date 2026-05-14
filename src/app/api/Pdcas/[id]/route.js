import Pdca from "@/app/models/Pdca";
import { NextResponse } from "next/server";
import { put, del } from '@vercel/blob';
// import connectDB from "@/path/to/your/connectDB"; // 💡 นำเข้าและเรียกใช้ connectDB ถ้าคุณสร้างไว้แล้ว

// --- ฟังก์ชันช่วย: parseFormData ---

// แปลง FormData ของ Next.js เป็น object และจัดการการอัปโหลดไฟล์
async function parseFormData(req) {
  const formData = await req.formData();
  const data = {};
  const attachments = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0 && key.startsWith("filepdf")) {
      // 🚀 อัปโหลดไปยัง Vercel Blob
      const buffer = Buffer.from(await value.arrayBuffer());

      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
      const filename = `${Date.now()}-${value.name.replaceAll(' ', '_')}`;

      // Put file to Vercel Blob storage
      const { url } = await put(filename, buffer, { access: 'public' });

      attachments.push({ fileUrl: url, originalFileName: value.name });
    } else {
      data[key] = value;
    }
  }

  // Handle multiple attachments
  if (attachments.length > 0) {
    data.attachments = attachments;
    // Backward compatibility for single file
    data.fileUrl = attachments[0].fileUrl;
    data.originalFileName = attachments[0].originalFileName;
  }

  // Process existing attachments passed from frontend
  if (data.existingAttachments) {
    try {
      const existing = JSON.parse(data.existingAttachments);
      if (Array.isArray(existing)) {
        data.attachments = [...existing, ...(data.attachments || [])];
      }
    } catch (e) {
      console.error("Error parsing existing attachments:", e);
    }
    delete data.existingAttachments;
  }

  return data;
}

// -------------------------------------------------------------------
// --- GET (ดึงข้อมูล) ---
export async function GET(req, { params }) {
  // await connectDB(); 
  try {
    const { id } = await params;
    const foundPdca = await Pdca.findById(id);

    if (!foundPdca) return NextResponse.json({ message: "Pdca not found" }, { status: 404 });
    return NextResponse.json({ foundPdca }, { status: 200 });
  } catch (err) {
    console.error("GET API Error:", err);
    return NextResponse.json({ message: "Error fetching PDCA", error: err.message }, { status: 500 });
  }
}

// -------------------------------------------------------------------
// --- PUT (อัปเดตข้อมูลและไฟล์) ---
export async function PUT(req, { params }) {
  // await connectDB(); 
  const { id } = await params;

  try {
    const pdcaData = await parseFormData(req);
    const existingPdca = await Pdca.findById(id);

    // ตรวจสอบและจัดการไฟล์เก่า
    if (existingPdca) {
      // 1. ตรวจสอบว่ามีการลบไฟล์เก่า หรือมีการอัปโหลดไฟล์ใหม่หรือไม่
      if (existingPdca.fileUrl && (pdcaData.fileAction === "DELETE" || pdcaData.fileUrl)) {
        // ลบไฟล์เก่าออกจาก Vercel Blob
        await del(existingPdca.fileUrl);
      }

      // 2. ปรับข้อมูลที่จะอัปเดตตาม fileAction
      if (pdcaData.fileAction === "DELETE") {
        pdcaData.fileUrl = null;
        pdcaData.originalFileName = null;
      } else if (pdcaData.fileAction === "RETAIN" && !pdcaData.fileUrl) {
        // RETAIN และไม่มีไฟล์ใหม่ถูกอัปโหลด (fileUrl ถูกตั้งค่าใน parseFormData แล้วถ้ามีไฟล์)
        // ใช้ URL เดิม
        pdcaData.fileUrl = existingPdca.fileUrl;
        pdcaData.originalFileName = existingPdca.originalFileName;
      }
    }

    // ลบคีย์ที่ไม่เกี่ยวข้องกับการอัปเดต Mongoose ออก
    delete pdcaData.fileAction;

    // 3. อัปเดต Mongoose
    const updatedPdca = await Pdca.findByIdAndUpdate(
      id,
      pdcaData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedPdca) {
      return NextResponse.json({ message: "PDCA not found for update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pdca Updated", updatedPdca }, { status: 200 });

  } catch (err) {
    console.error("PUT API Error (Final Check):", err);

    // ดักจับ Validation Error ของ Mongoose
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { message: "Validation failed. Data does not match the schema.", errors: err.errors },
        { status: 400 } // Bad Request
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error updating Pdca", error: err.message },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------------
// --- DELETE (ลบข้อมูลและไฟล์) ---
export async function DELETE(req, { params }) {
  // await connectDB();
  try {
    const { id } = await params;
    const pdcaToDelete = await Pdca.findById(id);

    // 🗑️ ลบไฟล์ออกจาก Vercel Blob ก่อนลบเอกสาร
    if (pdcaToDelete && pdcaToDelete.fileUrl) {
      await del(pdcaToDelete.fileUrl);
    }

    await Pdca.findByIdAndDelete(id);
    return NextResponse.json({ message: "Pdca Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE API Error:", err);
    return NextResponse.json({ message: "Error deleting Pdca", error: err.message }, { status: 500 });
  }
}