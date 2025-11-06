import EventDetailsShell from "@/components/EventDetailsShell";
import Loader from "@/components/loader";
import { Suspense } from "react";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>  }) => {
const slug = params.then((p)=> p.slug)
return(
  <main>
    <Suspense fallback={<Loader/>}>
    <EventDetailsShell params={slug}/>
    </Suspense>
  </main>
)
};

export default EventDetailsPage;
