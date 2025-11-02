/* eslint-disable react/no-unescaped-entities */
import { events } from "@/lib/constants";
import ExploreBtn from "./../utils/ExploreBtn";
import EventCard from "@/components/EventCard";

const page = () => {
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
          {events.map((event)=>(
            <li key={event.title}><EventCard {...event}/></li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
