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


import Pdca from "@/app/models/Pdca";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser ของ Next.js เพื่อจัดการ multipart/form-data เอง
  },
};

// ฟังก์ชันช่วยแปลง FormData ของ Next.js เป็น object
async function parseFormData(req) {
  const formData = await req.formData();
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      // เก็บไฟล์ชั่วคราวในโฟลเดอร์ /public/uploads
      const filePath = path.join(process.cwd(), "public", value.name);
      const buffer = Buffer.from(await value.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      data.fileUrl = `${value.name}`; // เก็บ path สำหรับ download
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
    const { id } = params;
    const foundPdca = await Pdca.findById(id);
    if (!foundPdca) return NextResponse.json({ message: "Pdca not found" }, { status: 404 });
    return NextResponse.json({ foundPdca }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

// PUT: อัปเดต Pdca
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const pdcaData = await parseFormData(req);

    // เช็ค fileAction เพื่อจัดการไฟล์เดิม
    if (pdcaData.fileAction === "DELETE") {
      pdcaData.fileUrl = null;
      pdcaData.originalFileName = null;
    } else if (pdcaData.fileAction === "RETAIN") {
      delete pdcaData.filepdf; // ลบไฟล์ที่ไม่ได้อัปโหลดใหม่
    }

    const updatedPdca = await Pdca.findByIdAndUpdate(id, pdcaData, { new: true });

    return NextResponse.json({ message: "Pdca Updated", updatedPdca }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating Pdca", err }, { status: 500 });
  }
}

// DELETE: ลบ Pdca
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await Pdca.findByIdAndDelete(id);
    return NextResponse.json({ message: "Pdca Deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error deleting Pdca", err }, { status: 500 });
  }
}
