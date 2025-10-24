import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        // รับข้อมูล formData ที่ส่งมาจาก client
        const formData = await req.formData();
        const file = formData.get("file");

        // ตรวจสอบว่ามีไฟล์จริงไหม
        if (!file) {
            return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
        }

        // ตรวจสอบประเภทไฟล์ (อนุญาตเฉพาะ PDF)
        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "อนุญาตเฉพาะไฟล์ PDF เท่านั้น" }, { status: 400 });
        }

        // อ่านไฟล์เป็น Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // ตั้งชื่อไฟล์ใหม่ (กันชื่อซ้ำ)
        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const filename = `${timestamp}_${safeFilename}`;
        const filePath = path.join(uploadDir, filename);

        // เขียนไฟล์ลงเครื่อง
        await fs.promises.writeFile(filePath, buffer);

        // สร้าง URL สำหรับเข้าถึงไฟล์
        const fileUrl = `${filename}`;

        return NextResponse.json({
            message: "อัปโหลดไฟล์สำเร็จ",
            filename,
            fileUrl,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" },
            { status: 500 }
        );
    }
}
