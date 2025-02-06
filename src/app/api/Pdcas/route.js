import Pdca from "@/app/models/Pdca";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pdcas = await Pdca.find();

    return NextResponse.json({ pdcas }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const pdcaData = body.formData;

    await Pdca.create(pdcaData);

    return NextResponse.json({ messsge: "Create Pdca" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ messsge: "Error", err }, { status: 500 });
  }
}
