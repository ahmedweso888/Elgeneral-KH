import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import HistoricalMap from "@/components/history/HistoricalMap";
import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  Landmark,
  Calendar,
  MapPin,
  ScrollText,
  PlayCircle,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/student/history/$eraId"
)({
  component: StudentHistoryTimelinePage,
});

function StudentHistoryTimelinePage() {
  const { eraId } = Route.useParams();

  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<any>(null);

  const [era, setEra] = useState<any>(null);

  const [events, setEvents] = useState<any[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedEvent = useMemo(() => {
    return events[selectedIndex] ?? null;
  }, [events, selectedIndex]);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    //-----------------------------------------
    // الطالب
    //-----------------------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("students")
        .select("*")
        .eq("id", user.id)
        .single();

      setStudent(data);
    }

    //-----------------------------------------
    // العصر
    //-----------------------------------------

    const { data: eraData } = await supabase
      .from("historical_eras")
      .select("*")
      .eq("id", eraId)
      .single();

    setEra(eraData);

    //-----------------------------------------
    // الأحداث
    //-----------------------------------------

    const { data: timeline } = await supabase
      .from("timeline")
      .select(`
        *,
        videos(
          id,
          title,
          hls_url,
          cloudfront_url,
          video_url
        )
      `)
      .eq("era_id", eraId)
      .eq("is_published", true)
      .order("order_index");

    setEvents(timeline ?? []);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center text-xl font-bold">
        جاري تحميل العصر...
      </div>
    );
  }

  if (!era) {
    return (
      <div className="container mx-auto py-20 text-center text-2xl font-black">
        هذا العصر غير موجود.
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto py-20">

        <Card className="p-16 text-center space-y-6">

          <Landmark className="mx-auto h-14 w-14 text-primary"/>

          <h1 className="text-4xl font-black">

            {era.title}

          </h1>

          <p className="text-muted-foreground text-lg">

            لا توجد أحداث داخل هذا العصر حتى الآن.

          </p>

          <Button asChild>

            <Link to="/student/history">

              <ArrowLeft className="mr-2 h-4 w-4"/>

              الرجوع للعصور

            </Link>

          </Button>

        </Card>

      </div>
    );
  }
    return (

    <div className="container mx-auto py-8 space-y-10">

      {/* Hero */}

      <Card className="overflow-hidden">

        <div className="relative">

          <img
            src={
              era.image_url ||
              "/placeholder.png"
            }
            alt={era.title}
            className="h-[430px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute top-6 left-6">

            <Button
              asChild
              variant="secondary"
            >

              <Link to="/student/history">

                <ArrowLeft className="mr-2 h-4 w-4" />

                رجوع

              </Link>

            </Button>

          </div>

          <div className="absolute bottom-0 right-0 p-10 text-white max-w-4xl">

            <div className="flex items-center gap-4">

              <Landmark className="h-12 w-12 shrink-0" />

              <div>

                <h1 className="text-5xl font-black">

                  {era.title}

                </h1>

                <p className="mt-5 text-lg leading-9 text-gray-200">

                  {era.description}

                </p>

              </div>

            </div>

          </div>

        </div>

      </Card>

      {/* Timeline */}

      <Card className="p-8">

        <h2 className="mb-10 text-center text-3xl font-black">

          الخط الزمني

        </h2>

        <div className="overflow-x-auto">

          <div className="relative flex min-w-max items-start justify-between gap-16 px-10 pb-5">

            <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-muted" />

            {events.map((event, index) => (

              <button
                key={event.id}
                onClick={() => setSelectedIndex(index)}
                className="relative z-10 flex flex-col items-center transition-all duration-300"
              >

                <div
                  className={`rounded-full border-4 transition-all duration-300

                  ${
                    selectedIndex === index
                      ? "h-8 w-8 scale-125 border-primary bg-primary shadow-lg"
                      : "h-6 w-6 border-primary bg-background"
                  }`}
                />

                <div className="mt-5 w-36 text-center">

                  <div
                    className={`font-black transition-all

                    ${
                      selectedIndex === index
                        ? "text-2xl text-primary"
                        : "text-lg text-muted-foreground"
                    }`}
                  >

                    {event.year}

                  </div>

                  <div
                    className={`mt-2 line-clamp-2 text-sm transition-all

                    ${
                      selectedIndex === index
                        ? "font-bold text-primary"
                        : "text-muted-foreground"
                    }`}
                  >

                    {event.title}

                  </div>

                </div>

              </button>

            ))}

          </div>

        </div>

      </Card>
            {/* Event */}

      {selectedEvent && (

        <Card className="overflow-hidden">

          <img
            src={
              selectedEvent.image_url ||
              "/placeholder.png"
            }
            alt={selectedEvent.title}
            className="h-[450px] w-full object-cover"
          />

          <div className="space-y-8 p-8">

            <div>

              <h2 className="text-4xl font-black">

                {selectedEvent.title}

              </h2>

              <div className="mt-5 flex flex-wrap gap-8 text-muted-foreground">

                <div className="flex items-center gap-2">

                  <Calendar className="h-5 w-5" />

                  <span>

                    {selectedEvent.year}

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <MapPin className="h-5 w-5" />

                  <span>

                    {selectedEvent.location || "غير محدد"}

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <ScrollText className="h-5 w-5" />

                  <span>

                    {selectedEvent.category || "عام"}

                  </span>

                </div>

              </div>

            </div>

            <div className="grid gap-8 lg:grid-cols-2">

              <Card className="p-6">

                <h3 className="mb-4 text-2xl font-black">

                  نبذة عن الحدث

                </h3>

                <p className="leading-9 whitespace-pre-wrap">

                  {selectedEvent.description}

                </p>

              </Card>

              <Card className="p-6">

                <h3 className="mb-4 text-2xl font-black">

                  أسباب الحدث

                </h3>

                <p className="leading-9 whitespace-pre-wrap">

                  {selectedEvent.causes || "لا توجد بيانات"}

                </p>

              </Card>

            </div>

            <Card className="p-6">

              <h3 className="mb-4 text-2xl font-black">

                نتائج الحدث

              </h3>

              <p className="leading-9 whitespace-pre-wrap">

                {selectedEvent.results || "لا توجد بيانات"}

              </p>

            </Card>
                        {/* Video */}

            {selectedEvent.videos && (

              <Card className="overflow-hidden">

                <div className="border-b p-6">

                  <div className="flex items-center gap-3">

                    <PlayCircle className="h-7 w-7 text-primary" />

                    <h3 className="text-2xl font-black">

                      شرح الحدث بالفيديو

                    </h3>

                  </div>

                </div>

                <ProtectedVideoPlayer

                  src={
                    selectedEvent.videos.hls_url ||
                    selectedEvent.videos.cloudfront_url ||
                    selectedEvent.videos.video_url
                  }

                  studentName={
                    student?.full_name ?? ""
                  }

                  studentEmail={
                    student?.email ?? ""
                  }

                  studentPhone={
                    student?.phone ?? ""
                  }

                />

              </Card>

            )}

            {/* Map */}

            {selectedEvent.latitude &&
              selectedEvent.longitude && (

              <Card className="overflow-hidden">

                <div className="border-b p-6">

                  <h3 className="text-2xl font-black">

                    موقع الحدث

                  </h3>

                </div>

                <HistoricalMap

                  latitude={Number(selectedEvent.latitude)}

                  longitude={Number(selectedEvent.longitude)}

                  title={selectedEvent.title}

                />

              </Card>

            )}
                      </div>

        </Card>

      )}

      {/* أحداث أخرى */}

      <Card className="p-8">

        <h2 className="mb-8 text-3xl font-black">

          أحداث أخرى داخل العصر

        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {events

            .filter((_, index) => index !== selectedIndex)

            .map((event) => (

              <Card

                key={event.id}

                onClick={() => {

                  const newIndex = events.findIndex(

                    (e) => e.id === event.id

                  );

                  setSelectedIndex(newIndex);

                  window.scrollTo({

                    top: 0,

                    behavior: "smooth",

                  });

                }}

                className="cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"

              >

                <img

                  src={

                    event.image_url ||

                    "/placeholder.png"

                  }

                  alt={event.title}

                  className="h-44 w-full object-cover"

                />

                <div className="space-y-2 p-4">

                  <h3 className="line-clamp-2 text-lg font-black">

                    {event.title}

                  </h3>

                  <p className="text-muted-foreground">

                    {event.year}

                  </p>

                </div>

              </Card>

            ))}

        </div>

      </Card>

    </div>

  );

}

export default StudentHistoryTimelinePage;