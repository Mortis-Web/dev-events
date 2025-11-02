import Image from "next/image";
import Link from "next/link";

type EventPropTypes = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};
const EventCard = ({ title, image, slug, location, date, time }: EventPropTypes) => {
  return (
    <Link href={`/events/${slug}`} id="event-card" className="group overflow-hidden">
      <div className="overflow-hidden rounded-[inherit]">
        <Image
          alt={title}
          src={image}
          width={410}
          height={300}
          className="poster brightness-90 transition-all duration-500 group-hover:scale-125 group-hover:brightness-110"
        />
      </div>
      <div className="flex flex-row gap-2">
        <Image src={"/icons/pin.svg"} alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>

      <div className="divide-light-200 flex divide-x">
        <span className="flex flex-row gap-2 pr-2">
          <Image src={"/icons/calendar.svg"} alt="date" width={14} height={14} />
          <p>{date}</p>
        </span>
        <span className="flex flex-row gap-2 pl-2">
          <Image src={"/icons/clock.svg"} alt="time" width={14} height={14} />
          <p>{time}</p>
        </span>
      </div>
    </Link>
  );
};

export default EventCard;
