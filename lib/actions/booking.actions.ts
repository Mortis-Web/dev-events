'use server'

import { Booking } from "@/database";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
  try {
        console.log("🟢 createBooking called:", { eventId, slug, email })

    await connectDB();
    console.log("🟢 connected to DB")

    const booking = await Booking.create({ eventId, slug, email })
    console.log("✅ Booking created:", booking)

    return { success: true };
  } catch (err) {
    console.error("create booking failed:", err);

    return { success: false};
  }
};
