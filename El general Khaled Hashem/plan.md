
# منصة الأستاذ خالد هاشم — Plan

Bilingual note: UI is Arabic (RTL). This plan is in English for clarity; all in-app copy will be Arabic.

## Stack
- TanStack Start + Tailwind v4 + shadcn (existing).
- Lovable Cloud (Supabase) for auth, DB, storage, edge.
- Lovable AI Gateway (`google/gemini-3-flash-preview`) for all AI features.
- `dir="rtl"` on `<html>`, Arabic font (Cairo via `@fontsource/cairo`).

## Auth & Roles
- Email/password + Google sign-in.
- `profiles` table (full_name, grade, avatar).
- `user_roles` table + `app_role` enum (`student`, `teacher`) + `has_role()` security-definer function.
- Teacher account seeded; first sign-up with teacher email is promoted via migration.
- Route guards: `_authenticated/` for students, `_authenticated/_teacher/` for admin.

## Routes
```
/                       landing (teacher hero, features, login CTA)
/auth                   login/signup
/_authenticated/
  dashboard             student home (kingdom summary, next lesson, weak areas)
  timeline              interactive history timeline
  timeline/$year        year detail (events list)
  events/$eventId       event page (video, images, quiz)
  assistant             AI teaching assistant chat
  exams                 exam list + take exam
  exams/$examId/result  AI performance analysis + study plan
  predictions           exam prediction system
  kingdom               gamification (XP, gold, buildings, figures)
  leaderboard
  _teacher/
    admin               teacher dashboard
    admin/curriculum    upload units/lessons/events/documents
    admin/exams         create exams + question bank
    admin/students      roster + analytics
    admin/style         teacher's teaching-style prompt config
```

## Database (public schema, RLS + GRANTs)
- `profiles(user_id pk, full_name, grade, avatar_url)`
- `user_roles(user_id, role)`
- `units(id, title, order_index)`
- `lessons(id, unit_id, title, content, order_index)`
- `historical_events(id, year, title, summary, video_url, image_urls[], lesson_id)`
- `event_links(from_event, to_event, relation)` — cause/effect graph for timeline
- `quizzes(id, event_id|lesson_id, title)`
- `questions(id, quiz_id, type, prompt, choices jsonb, correct, unit_id, difficulty)`
- `exams(id, title, scheduled_at, duration_min)`
- `exam_questions(exam_id, question_id, order_index)`
- `exam_attempts(id, user_id, exam_id, score, started_at, finished_at)`
- `answer_log(attempt_id, question_id, answer, is_correct, time_ms)`
- `performance_insights(user_id, exam_id, summary, weak_units[], predicted_final, study_plan jsonb)`
- `kingdom(user_id pk, gold, xp, level, buildings jsonb, unlocked_figures[])`
- `assistant_threads(id, user_id, title)` + `assistant_messages(thread_id, role, parts jsonb)`
- `prediction_runs(id, generated_at, payload jsonb)` — exam predictions cached
- `teacher_style(id, system_prompt, sample_qa jsonb)` — single row
- `historical_exams(id, year, content)` — past exams for prediction model
- Storage buckets: `curriculum` (private, teacher write), `media` (public read for event images/video).

RLS: students read curriculum/quizzes/events; write only their own attempts/kingdom/threads. Teacher (`has_role('teacher')`) full CRUD on content tables.

## AI Features (server functions, all via Lovable AI Gateway)

1. **Performance Analysis** — `analyzePerformance.functions.ts`: after exam submit, sends attempt + answer_log + curriculum map to Gemini with structured output (`Output.object`) → writes `performance_insights`. Result page renders summary, weak units, predicted final, study plan checklist.

2. **Interactive Timeline** — Pure frontend (Framer Motion) reading `historical_events` + `event_links`. Horizontal scrollable timeline; zoom into year → event cards; SVG lines for cause/effect. Event page embeds video + images + quiz.

3. **Gamification** — `kingdom` table updates on quiz/exam completion (gold + XP via DB trigger or server fn). Kingdom page: SVG/illustration of buildings unlocking by level; figures gallery; `/leaderboard` ranks by XP.

4. **AI Teaching Assistant** — `/api/chat` TanStack server route using AI SDK `streamText` + `useChat`. System prompt = `teacher_style.system_prompt` + retrieved curriculum chunks (simple keyword filter on lessons MVP; embeddings later). Always appends 2 follow-up questions via structured output post-stream. Threaded chat (per `chat-agent-ui-contract`: threads + database).

5. **Exam Prediction** — `runExamPredictions.functions.ts` (teacher-triggered, cached): feeds `historical_exams` + lesson list to Gemini with structured output → `{ unit_predictions: [{unit, probability, reasoning}], priority_lessons: [...] }`. Students view at `/predictions`.

## Teacher Admin
- Curriculum upload: units → lessons (rich text), events (form: year, title, video URL, image upload, links to other events).
- Question bank + exam builder (drag-order, schedule).
- Teaching style: textarea for system prompt + sample Q&A pairs (saved to `teacher_style`).
- Student analytics: aggregate weak units, avg scores.

## UI / Design
- Arabic RTL, font Cairo.
- Theme: deep navy `#0B1E3F` + gold `#D4A24C` + parchment off-white `#F7F1E3` (evokes Egyptian history without being kitsch).
- shadcn components themed via `src/styles.css` tokens.
- Sidebar nav (collapsible) for authed area; landing page is marketing-style with teacher photo placeholder, feature cards, CTA.

## Build Order
1. Cloud + auth + roles + RTL theme + landing + sidebar shell.
2. Teacher admin: curriculum + events + questions + exams.
3. Student timeline + event pages + quizzes.
4. Exams flow + Performance Analysis AI.
5. Gamification (kingdom + leaderboard).
6. AI Teaching Assistant (threaded chat).
7. Exam Prediction System.

## Out of scope (MVP)
- Payments/subscriptions.
- Live video classes.
- Mobile apps.
- Embeddings-based RAG (keyword retrieval for now; upgrade later).
- Voice input for assistant.

Ready to build on approval.
