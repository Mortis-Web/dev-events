import mongoose, { CallbackWithoutResultAndOptionalError, Document, Schema } from "mongoose";
import Event from "./event.model"; // adjust path if needed

// Define the Booking interface
export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  eventId: mongoose.Types.ObjectId;
}

// Define the Booking schema
const bookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true }
);

// ✅ Validate referenced event before saving
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

// ✅ Validate referenced event before update (findOneAndUpdate / updateOne)
bookingSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<IBooking> | null;

  if (update && "eventId" in update && update.eventId) {
    try {
      const eventExists = await Event.exists({ _id: update.eventId });
      if (!eventExists) {
        return next(new Error(`Event with ID ${update.eventId} does not exist`));
      }
    } catch (err) {
      return next(
        new Error(
          `Failed to validate event reference: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        )
      );
    }
  }

  next();
});

// ✅ Handle duplicate key errors (unique email per event, for example)
bookingSchema.post(
  "save",
  function (
    error: Error & { code?: number; name?: string },
    _doc: IBooking,
    next: CallbackWithoutResultAndOptionalError
  ) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      next(new Error("This email has already booked this event."));
    } else {
      next(error);
    }
  }
);

// ✅ Create and export model
export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
