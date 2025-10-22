import Academic from '@/app/models/Academic';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const academics = await Academic.find();

    return NextResponse.json({ academics }, { status: 200 });
  } catch (err) {
    console.error("❌ DevDepartment fetch error:", err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  ////////////////////////////////////////////// NOtify Line //////////////////////////////////////////////
  const axios = require('axios');
  // let data = JSON.stringify({
  //   "to": "Cff6e2d23bf3c718620c38c98c3462ba1",
  //   "messages": [
  //     {
  //       "type": "text",
  //       "text": "You Have NEW PDCA ฝ่ายวิชาการ" + " " +
  //         "คลิกเพื่อดู" + " " +
  //         "https://ktltcp.vercel.app/academic" + " "
  //     }
  //   ]
  // });

  // let config = {
  //   method: 'post',
  //   maxBodyLength: Infinity,
  //   url: 'https://api.line.me/v2/bot/message/push',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     "Authorization": "Bearer LuVp1mV6NLHuAdPxbf3+XlqWBsxtEhLElHYlDjWAwURwKk2XGtjXvkYmevwGX02HqxLceZsEEtbsVDrmbTTeArQcRg9q8RsCopa7niK+DyoAkZl87MfgjV1bVPK3TO/QSbobW/UNW4y8TsSMYpze0QdB04t89/1O/w1cDnyilFU="
  //   },
  //   notificationDisabled: true, // เปลี่ยนเป็น true หากต้องการปิดการแจ้งเตือน
  //   data: data
  // };

  // axios.request(config)
  //   .then((response) => {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  ////////////////////////////////////////////// NOtify Line //////////////////////////////////////////////


  try {
    const body = await req.json();
    const academicData = body.formData;

    await Academic.create(academicData);

    return NextResponse.json({ messsge: "Create Academic" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}
