import BookEvent from "@/components/BookEvent";
import EventAgenda from "@/components/EventAgenda";
import EventCard from "@/components/EventCard";
import EventDetailItem from "@/components/EventDetailItem";
import EventTag from "@/components/EventTag";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailsShell = async ({params}:{params: Promise<string>}) => {
      'use cache'
cacheLife('hours')
  const slug  = await params;

 let data;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`, {
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        if (res.status === 404) return notFound();
        throw new Error(`Failed to fetch event: ${res.statusText}`);
      }

      const json = await res.json();
      data = json.data;
    } catch (err) {
      console.error("Request failed:", err);
      return notFound();
    }

  if (!data || !data.description) return notFound();


  const {
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
  } = data;

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
            <EventAgenda
              agendaItems={agenda?.filter((item?: string) => typeof item === "string") || []}
            />
          </article>

          <article className="flex flex-col gap-2">
            <h2>About The Organizer</h2>
            <p>{organizer}</p>
          </article>

          <article className="flex flex-row flex-wrap gap-2">
            {tags?.map((tag: string) => (
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
            <BookEvent eventId={data.id} slug={data.slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 ? (
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent._id.toString()} {...similarEvent} />
            ))
          ) : (
            <p>No similar events found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventDetailsShell
