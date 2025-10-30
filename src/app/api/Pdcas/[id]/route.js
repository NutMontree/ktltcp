// import Pdca from "@/app/models/Pdca";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   const { id } = params;

//   const foundPdca = await Pdca.findOne({ _id: id });
//   return NextResponse.json({ foundPdca }, { status: 200 });
// }

// export async function PUT(req, { params }) {
//   try {
//     const { id } = params;

//     const body = await req.json();
//     const pdcaData = body.formData;

//     const updatePdcaData = await Pdca.findByIdAndUpdate(id, {
//       ...pdcaData,
//     });

//     return NextResponse.json({ message: "Pdca Update" }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "Error", err }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     const { id } = params;

//     await Pdca.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Pdca Delete" }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "Error", err }, { status: 500 });
//   }
// }

// ในไฟล์ API Route ของคุณ

// ฟังก์ชันช่วยแปลง FormData ของ Next.js เป็น object



import Pdca from "@/app/models/Pdca";
import { NextResponse } from "next/server"; // ✅ แก้ไข: ต้อง Import NextResponse
import fs from "fs";
import path from "path"; // ✅ แก้ไข: ต้อง Import path

// การตั้งค่านี้อาจไม่จำเป็นใน App Router แต่ถ้ายังใช้เพื่อให้ FormData ทำงานได้ก็เก็บไว้
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
    if (value instanceof File) {
      // 🚨 คำเตือน: การเขียนไฟล์แบบนี้จะไม่ทำงานใน Production บน Vercel 
      // ควรใช้ External Storage เช่น Vercel Blob, S3
      const filePath = path.join(process.cwd(), "public", value.name);
      const buffer = Buffer.from(await value.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      data.fileUrl = `${value.name}`;
      data.originalFileName = value.name;
    } else {
      data[key] = value;
    }
  }

  return data;
}

// GET: ดึง Pdca ตาม id
export async function GET(req, { params }) {
  try {
    const { id } = params; // ✅ แก้ไข: ดึง id ออกมาโดยตรง
    const foundPdca = await Pdca.findById(id);
    if (!foundPdca) return NextResponse.json({ message: "Pdca not found" }, { status: 404 });
    return NextResponse.json({ foundPdca }, { status: 200 });
  } catch (err) {
    console.error("GET API Error:", err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

// PUT: อัปเดต Pdca
export async function PUT(req, { params }) {
  const { id } = params; // ✅ แก้ไข: ดึง id ออกมาโดยตรง

  try {
    const pdcaData = await parseFormData(req);

    // จัดการไฟล์/ข้อมูลก่อนอัปเดต
    if (pdcaData.fileAction === "DELETE") {
      pdcaData.fileUrl = null;
      pdcaData.originalFileName = null;
    } else if (pdcaData.fileAction === "RETAIN") {
      delete pdcaData.filepdf;
    }

    // ลบคีย์ที่ไม่เกี่ยวข้องกับการอัปเดต Mongoose ออก
    delete pdcaData.fileAction;

    // อัปเดต Mongoose พร้อมเปิดใช้งาน Validation
    const updatedPdca = await Pdca.findByIdAndUpdate(
      id,
      pdcaData,
      {
        new: true,
        runValidators: true // แนะนำให้เปิดใช้งานเพื่อป้องกัน Schema Error
      }
    );

    if (!updatedPdca) {
      return NextResponse.json({ message: "PDCA not found for update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pdca Updated", updatedPdca }, { status: 200 });

  } catch (err) {
    console.error("PUT API Error:", err);

    // ดักจับ Validation Error
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { message: "Validation failed. Data does not match the schema.", errors: err.errors },
        { status: 400 } // Bad Request
      );
    }

    return NextResponse.json({ message: "Internal Server Error updating Pdca", error: err.message }, { status: 500 });
  }
}

// DELETE: ลบ Pdca
export async function DELETE(req, { params }) {
  try {
    const { id } = params; // ✅ แก้ไข: ดึง id ออกมาโดยตรง
    await Pdca.findByIdAndDelete(id);
    return NextResponse.json({ message: "Pdca Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE API Error:", err);
    return NextResponse.json({ message: "Error deleting Pdca", err }, { status: 500 });
  }
}