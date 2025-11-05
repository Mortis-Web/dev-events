import BookEvent from "@/components/BookEvent";
import EventAgenda from "@/components/EventAgenda";
import EventCard from "@/components/EventCard";
import EventDetailItem from "@/components/EventDetailItem";
import EventTag from "@/components/EventTag";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
  if (!response.ok) {
    return notFound();
  }
  const {
    data: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      organizer,
      tags,
    },
  } = await response.json();
  if (!description) return notFound();
  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="max-w-prose text-balance">{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="event banner"
            width={800}
            height={800}
            className="banner aspect-square"
          />
          <article className="flex flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </article>
          <article className="flex flex-col gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="location" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </article>

          <article>
            <EventAgenda agendaItems={agenda.filter((item?: string) => typeof item === "string")} />
          </article>

          <article className="flex flex-col gap-2">
            <h2>About The Organizer</h2>
            <p>{organizer}</p>
          </article>

          <article className="flex flex-row flex-wrap gap-2">
            {tags.map((tag: string) => (
              <EventTag key={tag} tag={tag} />
            ))}
          </article>
        </div>

        <aside className="booking top-20 lg:sticky">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} other people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent._id.toString()} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
