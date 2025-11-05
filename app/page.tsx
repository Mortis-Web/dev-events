/* eslint-disable react/no-unescaped-entities */
// import { events } from "@/lib/constants";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import ExploreBtn from "./../utils/ExploreBtn";

const page = async () => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const data = await response.json();
  const events = data.events;
  return (
    <section>
      <h1 className="text-center">
        The Hub For Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="mt-5 text-center">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn id={"explore-btn"} />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events?.length > 0 ? (
            events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <>
              <p className="text-3xl font-bold text-red-400">Nothing Found!</p>
            </>
          )}
        </ul>
      </div>
    </section>
  );
};

export default page;
