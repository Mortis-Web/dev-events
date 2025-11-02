import mongoose, { Document, Model, Schema, Types } from "mongoose";
import Event from "./event.model";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Unique compound index: one booking per event per email
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// 🧠 Optional: handle duplicate key error gracefully
bookingSchema.post("save", function (error: any, doc: IBooking, next: Function) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("This email has already booked this event."));
  } else {
    next(error);
  }
});

// ✅ Pre-save hook: verify that event exists
bookingSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("eventId")) {
    try {
      const eventExists = await Event.findById(this.eventId);
      if (!eventExists) {
        return next(new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (error) {
      return next(
        new Error(
          `Failed to validate event reference: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
    }
  }
  next();
});

// ✅ Create or reuse model
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
