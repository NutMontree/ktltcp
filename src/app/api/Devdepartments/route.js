// import Devdepartment from "@/app/models/Devdepartment";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const Devdepartments = await Devdepartment.find();

//     return NextResponse.json({ devdepartments }, { status: 200 });
//   } catch (err) {
//     console.error("❌ DevDepartment fetch error:", err);
//     return NextResponse.json({ messsge: "Error", err }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   ////////////////////////////////////////////// NOtify Line //////////////////////////////////////////////
//   const axios = require('axios');
//   // let data = JSON.stringify({
//   //   "to": "Cff6e2d23bf3c718620c38c98c3462ba1",
//   //   "messages": [
//   //     {
//   //       "type": "text",
//   //       "text": "You Have NEW PDCA ฝ่ายแผนงานและความร่วมมือ" + " " +
//   //         "คลิกเพื่อดู" + " " +
//   //         "https://ktltcp.vercel.app/devdepartment" + " "
//   //     }
//   //   ]
//   // });

//   // let config = {
//   //   method: 'post',
//   //   maxBodyLength: Infinity,
//   //   url: 'https://api.line.me/v2/bot/message/push',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     "Authorization": "Bearer LuVp1mV6NLHuAdPxbf3+XlqWBsxtEhLElHYlDjWAwURwKk2XGtjXvkYmevwGX02HqxLceZsEEtbsVDrmbTTeArQcRg9q8RsCopa7niK+DyoAkZl87MfgjV1bVPK3TO/QSbobW/UNW4y8TsSMYpze0QdB04t89/1O/w1cDnyilFU="
//   //   },
//   //   notificationDisabled: true, // เปลี่ยนเป็น true หากต้องการปิดการแจ้งเตือน
//   //   data: data
//   // };

//   // axios.request(config)
//   //   .then((response) => {
//   //     console.log(JSON.stringify(response.data));
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //   });
//   ////////////////////////////////////////////// NOtify Line //////////////////////////////////////////////

//   try {
//     const body = await req.json();
//     const devdepartmentData = body.formData;

//     await Devdepartment.create(devdepartmentData);

//     return NextResponse.json({ messsge: "Create Devdepartment" }, { status: 201 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ messsge: "Error", err }, { status: 500 });
//   }
// }



import Devdepartment from "@/app/models/Devdepartment";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const devdepartments = await Devdepartment.find();
    return NextResponse.json({ devdepartments }, { status: 200 });
  } catch (err) {
    console.error("❌ DevDepartment fetch error:", err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  const axios = require("axios");
  try {
    let devdepartmentData = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      devdepartmentData = body.formData;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      devdepartmentData.year = formData.get("year");
      devdepartmentData.department = formData.get("department");
      devdepartmentData.namework = formData.get("namework");
      devdepartmentData.nameproject = formData.get("nameproject");

      const file = formData.get("filepdf");
      if (file && file.name) {
        if (file.type !== "application/pdf") {
          return NextResponse.json(
            { message: "อนุญาตเฉพาะไฟล์ PDF เท่านั้น" },
            { status: 400 }
          );
        }

        // แปลงไฟล์เป็น buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ✅ บันทึกไฟล์ใน public/uploads (เหมือนเดิม)
        const uploadDir = path.join(process.cwd(), "public",);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const originalFilename = file.name;
        const filePath = path.join(uploadDir, originalFilename);
        await fs.promises.writeFile(filePath, buffer);

        // ✅ เพิ่มข้อมูลเก็บลง MongoDB
        devdepartmentData.fileName = originalFilename;
        devdepartmentData.fileUrl = `${originalFilename}`;
        devdepartmentData.fileData = buffer; // <— เก็บไฟล์จริงในฐานข้อมูล
        devdepartmentData.fileType = file.type;
      }
    } else {
      return NextResponse.json(
        { message: "Unsupported content type" },
        { status: 400 }
      );
    }

    await Devdepartment.create(devdepartmentData);

    return NextResponse.json({ message: "Create Devdepartment" }, { status: 201 });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}
