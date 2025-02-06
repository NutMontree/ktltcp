import Resource from "@/app/models/Resource";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resources = await Resource.find();

    return NextResponse.json({ resources }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const resourceData = body.formData;

    await Resource.create(resourceData);

    return NextResponse.json({ messsge: "Create Resource" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}
