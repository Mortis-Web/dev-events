/* eslint-disable react/no-unescaped-entities */
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import ExploreBtn from "./../utils/ExploreBtn";

const page = async () => {
  "use cache";
  cacheLife("hours");

  // ✅ Use a safe base URL for both local and Vercel builds
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  let events: IEvent[] = [];

  try {
    const response = await fetch(`${baseUrl}/api/events`, { cache: "no-store" });

    // Make sure the response is JSON, not HTML
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("❌ Expected JSON, got:", contentType);
      throw new Error("Invalid response format");
    }

    const data = await response.json();
    events = data.events || [];
  } catch (error) {
    console.error("❌ Failed to fetch events:", error);
  }

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
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="text-3xl font-bold text-red-400">Nothing Found!</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default page;
