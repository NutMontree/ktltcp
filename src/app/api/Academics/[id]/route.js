// import Academic from "@/app/models/Academic";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   const { id } = params;

//   const foundAcademic = await Academic.findOne({ _id: id });
//   return NextResponse.json({ foundAcademic }, { status: 200 });
// }

// export async function PUT(req, { params }) {
//   try {
//     const { id } = params;

//     const body = await req.json();
//     const academicData = body.formData;

//     const updateAcademicData = await Academic.findByIdAndUpdate(id, {
//       ...academicData,
//     });

//     return NextResponse.json({ message: "Academic Update" }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "Error", err }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     const { id } = params;

//     await Academic.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Academic Delete" }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "Error", err }, { status: 500 });
//   }
// }

// ในไฟล์ API Route ของคุณ

// ฟังก์ชันช่วยแปลง FormData ของ Next.js เป็น object

import Academic from "@/app/models/Academic";
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
    const foundAcademic = await Academic.findById(id);
    if (!foundAcademic) return NextResponse.json({ message: "Academic not found" }, { status: 404 });
    return NextResponse.json({ foundAcademic }, { status: 200 });
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
    const academicData = await parseFormData(req);
    const existingAcademic = await Academic.findById(id);

    // ตรวจสอบสถานะการจัดการไฟล์ (fileAction) และจัดการไฟล์เก่า
    if (existingAcademic && existingAcademic.fileUrl) {
      // 1. ผู้ใช้เลือก 'DELETE' หรืออัปโหลดไฟล์ใหม่ (academicData มี fileUrl ใหม่)
      if (academicData.fileAction === "DELETE" || academicData.fileUrl) {
        // ลบไฟล์เก่าออกจาก Vercel Blob ก่อน
        await del(existingAcademic.fileUrl);
      }
    }

    // 2. ปรับข้อมูลที่จะอัปเดต
    if (academicData.fileAction === "DELETE") {
      academicData.fileUrl = null;
      academicData.originalFileName = null;
    } else if (academicData.fileAction === "RETAIN") {
      // หากเลือก RETAIN และไม่มีการอัปโหลดไฟล์ใหม่ ให้ใช้ URL เดิม
      academicData.fileUrl = existingAcademic.fileUrl;
      academicData.originalFileName = existingAcademic.originalFileName;
    }

    // ลบคีย์ที่ไม่เกี่ยวข้องกับการอัปเดต Mongoose ออก
    delete academicData.fileAction;

    // 3. อัปเดต Mongoose พร้อมเปิดใช้งาน Validation
    const updatedAcademic = await Academic.findByIdAndUpdate(
      id,
      academicData,
      {
        new: true,
        runValidators: true // ✅ สำคัญ: ตรวจสอบ Validation
      }
    );

    if (!updatedAcademic) {
      return NextResponse.json({ message: "PDCA not found for update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Academic Updated", updatedAcademic }, { status: 200 });

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
      { message: "Internal Server Error updating Academic (Check BLOB_READ_WRITE_TOKEN)", error: err.message },
      { status: 500 }
    );
  }
}

// --- DELETE (ลบข้อมูลและไฟล์) ---
export async function DELETE(req, { params }) {
  // await connectDB(); // 💡 หากจำเป็นต้องเชื่อมต่อ DB ในแต่ละ Request
  try {
    const { id } = params;
    const academicToDelete = await Academic.findById(id);

    // 🗑️ ลบไฟล์ออกจาก Vercel Blob ก่อนลบเอกสาร
    if (academicToDelete && academicToDelete.fileUrl) {
      await del(academicToDelete.fileUrl);
    }

    await Academic.findByIdAndDelete(id);
    return NextResponse.json({ message: "Academic Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE API Error:", err);
    return NextResponse.json({ message: "Error deleting Academic", error: err.message }, { status: 500 });
  }
}