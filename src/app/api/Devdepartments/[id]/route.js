
import Devdepartment from "@/app/models/Devdepartment";
import { NextResponse } from "next/server";
import { put, del } from '@vercel/blob'; // สำหรับจัดการไฟล์ PDF
// import connectDB from "@/path/to/your/connectDB"; // 💡 ตรวจสอบว่าคุณมีการเรียกใช้ connectDB ใน API Route หรือไม่

// ปิด bodyParser เพื่อรับ FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// ฟังก์ชันช่วยแปลง FormData ของ Next.js เป็น object
async function parseFormData(req) {
  const formData = await req.formData();
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0) {
      // 🚀 อัปโหลดไปยัง Vercel Blob
      const buffer = Buffer.from(await value.arrayBuffer());

      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
      const filename = `${Date.now()}-${value.name.replaceAll(' ', '_')}`;

      // Put file to Vercel Blob storage
      const { url } = await put(filename, buffer, { access: 'public' });

      data.fileUrl = url; // บันทึก URL
      data.originalFileName = value.name;
    } else {
      data[key] = value;
    }
  }

  return data;
}

// --- GET (ดึงข้อมูล) ---
export async function GET(req, { params }) {
  // await connectDB(); // 💡 หากจำเป็นต้องเชื่อมต่อ DB ในแต่ละ Request
  try {
    const { id } = params;
    const foundDevdepartment = await Devdepartment.findById(id);
    if (!foundDevdepartment) return NextResponse.json({ message: "Devdepartment not found" }, { status: 404 });
    return NextResponse.json({ foundDevdepartment }, { status: 200 });
  } catch (err) {
    console.error("GET API Error:", err);
    return NextResponse.json({ message: "Error fetching PDCA", error: err.message }, { status: 500 });
  }
}

// --- PUT (อัปเดตข้อมูลและไฟล์) ---
export async function PUT(req, { params }) {
  // await connectDB(); // 💡 หากจำเป็นต้องเชื่อมต่อ DB ในแต่ละ Request
  const { id } = params;

  try {
    const devdepartmentData = await parseFormData(req);
    const existingDevdepartment = await Devdepartment.findById(id);

    // ตรวจสอบสถานะการจัดการไฟล์ (fileAction) และจัดการไฟล์เก่า
    if (existingDevdepartment && existingDevdepartment.fileUrl) {
      // 1. ผู้ใช้เลือก 'DELETE' หรืออัปโหลดไฟล์ใหม่ (devdepartmentData มี fileUrl ใหม่)
      if (devdepartmentData.fileAction === "DELETE" || devdepartmentData.fileUrl) {
        // ลบไฟล์เก่าออกจาก Vercel Blob ก่อน
        await del(existingDevdepartment.fileUrl);
      }
    }

    // 2. ปรับข้อมูลที่จะอัปเดต
    if (devdepartmentData.fileAction === "DELETE") {
      devdepartmentData.fileUrl = null;
      devdepartmentData.originalFileName = null;
    } else if (devdepartmentData.fileAction === "RETAIN") {
      // หากเลือก RETAIN และไม่มีการอัปโหลดไฟล์ใหม่ ให้ใช้ URL เดิม
      devdepartmentData.fileUrl = existingDevdepartment.fileUrl;
      devdepartmentData.originalFileName = existingDevdepartment.originalFileName;
    }

    // ลบคีย์ที่ไม่เกี่ยวข้องกับการอัปเดต Mongoose ออก
    delete devdepartmentData.fileAction;

    // 3. อัปเดต Mongoose พร้อมเปิดใช้งาน Validation
    const updatedDevdepartment = await Devdepartment.findByIdAndUpdate(
      id,
      devdepartmentData,
      {
        new: true,
        runValidators: true // ✅ สำคัญ: ตรวจสอบ Validation
      }
    );

    if (!updatedDevdepartment) {
      return NextResponse.json({ message: "PDCA not found for update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Devdepartment Updated", updatedDevdepartment }, { status: 200 });

  } catch (err) {
    console.error("PUT API Error (Final Check):", err);

    // 🚨 ดักจับ Validation Error ของ Mongoose
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { message: "Validation failed. Data does not match the schema.", errors: err.errors },
        { status: 400 } // Bad Request
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error updating Devdepartment (Check BLOB_READ_WRITE_TOKEN)", error: err.message },
      { status: 500 }
    );
  }
}

// --- DELETE (ลบข้อมูลและไฟล์) ---
export async function DELETE(req, { params }) {
  // await connectDB(); // 💡 หากจำเป็นต้องเชื่อมต่อ DB ในแต่ละ Request
  try {
    const { id } = params;
    const devdepartmentToDelete = await Devdepartment.findById(id);

    // 🗑️ ลบไฟล์ออกจาก Vercel Blob ก่อนลบเอกสาร
    if (devdepartmentToDelete && devdepartmentToDelete.fileUrl) {
      await del(devdepartmentToDelete.fileUrl);
    }

    await Devdepartment.findByIdAndDelete(id);
    return NextResponse.json({ message: "Devdepartment Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE API Error:", err);
    return NextResponse.json({ message: "Error deleting Devdepartment", error: err.message }, { status: 500 });
  }
}