import Pdca from "@/app/models/Pdca";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  const foundPdca = await Pdca.findOne({ _id: id });
  return NextResponse.json({ foundPdca }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const pdcaData = body.formData;

    const updatePdcaData = await Pdca.findByIdAndUpdate(id, {
      ...pdcaData,
    });

    return NextResponse.json({ message: "Pdca Update" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Pdca.findByIdAndDelete(id);
    return NextResponse.json({ message: "Pdca Delete" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
