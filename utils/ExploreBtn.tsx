"use client";
import Image from "next/image";

type ButtonPropTypes = {
  id: string;
};

const ExploreBtn: React.FC<ButtonPropTypes> = ({ id }) => {
  return (
    <button type="button" id={id} className="group mx-auto mt-7">
      <span className="absolute top-0 left-0 -z-10 mx-auto h-full w-50 -translate-x-[calc(100%+150px)] -skew-x-30 bg-linear-to-b from-white to-(--light-ray) opacity-45 blur-3xl ease-in-out group-hover:translate-x-[calc(100%+150px)] group-hover:transition-transform group-hover:duration-1000"></span>

      <a href="#events" className="duration-300 group-hover:text-(--light-ray)">
        {" "}
        Explore Events
      </a>
      <Image alt="arrowDown" width={24} height={24} src="/icons/arrow-down.svg" />
    </button>
  );
};

export default ExploreBtn;
