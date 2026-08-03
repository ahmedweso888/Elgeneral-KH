import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useDashboard() {
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<any>(null);
  const [kingdom, setKingdom] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
const [announcements, setAnnouncements] = useState<any[]>([]);
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    //-------------------------------------------------
    // Student
    //-------------------------------------------------

    const { data: studentData } = await supabase
  .from("students")
  .select("*")
  .eq("id", user.id)
  .single();

    if (!studentData) {
      setLoading(false);
      return;
    }

    setStudent(studentData);

    //-------------------------------------------------
    // Kingdom
    //-------------------------------------------------

    const { data: kingdomData } = await supabase
      .from("kingdom")
      .select("*")
      .eq("student_id", studentData.id)
      .single();

    setKingdom(kingdomData);

    //-------------------------------------------------
    // Leaderboard
    //-------------------------------------------------

    const { data: leaderboardData } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("student_id", studentData.id)
      .single();

    setLeaderboard(leaderboardData);

    //-------------------------------------------------
    // AI Prediction
    //-------------------------------------------------

    const { data: predictionData } = await supabase
      .from("ai_predictions")
      .select("*")
      .eq("student_id", studentData.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setPrediction(predictionData);

    //-------------------------------------------------
    // Last Result
    //-------------------------------------------------

    const { data: resultData } = await supabase
      .from("results")
      .select("*")
      .eq("student_id", studentData.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setLastResult(resultData);

    //-------------------------------------------------
    // Notifications
    //-------------------------------------------------

    const { data: notificationData } = await supabase
      .from("notifications")
      .select("*")
      .or(`target_grade.eq.${studentData.grade},target_grade.is.null`)
      .order("created_at", { ascending: false })
      .limit(5);

    setNotifications(notificationData ?? []);
//-------------------------------------------------
// Announcements
//-------------------------------------------------

const { data: announcementData } = await supabase
  .from("announcements")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(5);

setAnnouncements(announcementData ?? []);
    //-------------------------------------------------
    // Events
    //-------------------------------------------------

    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date");

    setEvents(eventData ?? []);

    setLoading(false);
  }

  return {
    loading,

    student,

    kingdom,

    leaderboard,

    prediction,

    lastResult,

    notifications,

    events,
    announcements,

    refresh: loadDashboard,
  };
}
