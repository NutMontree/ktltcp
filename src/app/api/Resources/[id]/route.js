import Resource from "@/app/models/Resource";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  const foundResource = await Resource.findOne({ _id: id });
  return NextResponse.json({ foundResource }, { status: 200 });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    const body = await req.json();
    const resourceData = body.formData;

    const updateResourceData = await Resource.findByIdAndUpdate(id, {
      ...resourceData,
    });

    return NextResponse.json({ message: "Resource Update" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Resource.findByIdAndDelete(id);
    return NextResponse.json({ message: "Resource Delete" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
