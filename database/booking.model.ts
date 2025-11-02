import mongoose, { CallbackWithoutResultAndOptionalError, Document, Schema } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  eventId: mongoose.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

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

const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
