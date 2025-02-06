import Academic from "@/app/models/Academic";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  const foundAcademic = await Academic.findOne({ _id: id });
  return NextResponse.json({ foundAcademic }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const academicData = body.formData;

    const updateAcademicData = await Academic.findByIdAndUpdate(id, {
      ...academicData,
    });

    return NextResponse.json({ message: "Academic Update" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Academic.findByIdAndDelete(id);
    return NextResponse.json({ message: "Academic Delete" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
