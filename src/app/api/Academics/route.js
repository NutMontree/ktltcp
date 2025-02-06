import Academic from "@/app/models/Academic";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const academics = await Academic.find();

    return NextResponse.json({ academics }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
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
