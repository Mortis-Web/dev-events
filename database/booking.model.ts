import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  email: string;
  slug: string;
  eventId?: mongoose.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
  {
    email: { type: String, required: true, lowercase: true },
    slug: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false, // removed required
    },
  },
  { timestamps: true }
);

// Optional: unique booking per event per email
bookingSchema.index({ email: 1, slug: 1 }, { unique: true });

const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
