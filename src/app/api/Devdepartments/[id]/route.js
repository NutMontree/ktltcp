import Devdepartment from "@/app/models/Devdepartment";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  const foundDevdepartment = await Devdepartment.findOne({ _id: id });
  return NextResponse.json({ foundDevdepartment }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const devdepartmentData = body.formData;

    const updateDevdepartmentData = await Devdepartment.findByIdAndUpdate(id, {
      ...devdepartmentData,
    });

    return NextResponse.json({ message: "Devdepartment Update" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Devdepartment.findByIdAndDelete(id);
    return NextResponse.json({ message: "Devdepartment Delete" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
