import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    for (const [key, value] of formData.entries()) {
  console.log("🧩", key, "=>", value);
}
    // ✅ Dynamically group all entries
const data: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "image") continue; // handle separately below

      if (data[key]) {
        // If key already exists, convert to array
        data[key] = Array.isArray(data[key])
          ? [...data[key], value.toString()]
          : [data[key].toString(), value.toString()];
      } else {
        data[key] = value.toString();
      }
    }

    // ✅ Upload image to Cloudinary (if present)
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "DevEvent" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    data.image = (uploadResult as { secure_url: string }).secure_url;

    // ✅ Create the event
    const createdEvent = await Event.create(data);

    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (err) {
    console.error("Event creation error:", err);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Event fetching failed", error: err },
      { status: 500 }
    );
  }
}
