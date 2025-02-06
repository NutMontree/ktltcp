import Devdepartment from "@/app/models/Devdepartment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const devdepartments = await Devdepartment.find();

    return NextResponse.json({ devdepartments }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const devdepartmentData = body.formData;

    await Devdepartment.create(devdepartmentData);

    return NextResponse.json(
      { messsge: "Create Devdepartment" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}
