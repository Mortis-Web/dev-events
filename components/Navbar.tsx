import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image alt="logo" width={24} height={24} src="/icons/logo.png" />
          <h4 className="max-xs:hidden">DevEvents</h4>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="createEvent">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
