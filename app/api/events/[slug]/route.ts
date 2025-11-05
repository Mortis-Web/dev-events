import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,

  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    // Extract and validate slug parameter
    const { slug } = await context.params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: slug.trim() }).lean().exec();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { success: false, message: `Event with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    // Log error for debugging (use proper logging in production)
    console.error("Error fetching event by slug:", error);

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while fetching the event",
      },
      { status: 500 }
    );
  }
}
