import { createFileRoute } from "@tanstack/react-router";

import { useDashboard } from "@/hooks/useDashbourd";

import ProfileCard from "@/components/dashbourd/ProfileCard";
import KingdomCard from "@/components/dashbourd/KingdomCard";
import StatsCards from "@/components/dashbourd/StatsCards";
import LatestResult from "@/components/dashbourd/LatestResult";
import NotificationsCard from "@/components/dashbourd/NotificationsCard";
import UpcomingEvents from "@/components/dashbourd/UpcomingEvents";
import AIPrediction from "@/components/dashbourd/AIPrediction";
import HomeAnnouncements from "@/components/dashbourd/HomeAnnouncements";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const {
    loading,
    student,
    kingdom,
    leaderboard,
    prediction,
    lastResult,
    notifications,
    events,
    announcements,
  } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">
          جاري تحميل لوحة التحكم...
        </h2>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 space-y-8">

      <ProfileCard student={student} />

      <StatsCards
        student={student}
        leaderboard={leaderboard}
      />

      <div className="grid lg:grid-cols-2 gap-6">

        <KingdomCard kingdom={kingdom} />

        <LatestResult result={lastResult} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <AIPrediction prediction={prediction} />

        <NotificationsCard notifications={notifications} />
        <HomeAnnouncements
  announcements={announcements}
/>

      </div>

      <UpcomingEvents events={events} />

    </main>
  );
}