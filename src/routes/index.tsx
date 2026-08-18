import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrainCircuit, Castle, Clock, MessageSquareText, Sparkles, Target, Move } from "lucide-react";

import teacherHeroUrl from "@/assests/teacher-hero.png";
import teacherCutoutUrl from "@/assests/teacher-cutout.png";
import teacherGeneralUrl from "@/assests/teacher-general.png";
import logo from "@/assests/logo.png";
import Footer from "@/components/layout/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
  meta: [
    {
      title: "الجنرال — التاريخ بأسلوب جديد",
    },
    {
      name: "description",
      content:
        "التاريخ مع الجنرال عبر الذكاء الاصطناعي، الخط الزمني التفاعلي، ومملكتك الخاصة.",
    },
  ],

  links: [
  {
    rel: "icon",
    href: "/favicon.png",
  },
  {
    rel: "apple-touch-icon",
    href: "/favicon.png",
  },
],
}),
  component: Landing,
});

const features = [
  { icon: BrainCircuit, title: "تحليل ذكي للأداء", text: "بعد كل امتحان يقدم الذكاء الاصطناعي تحليلاً مفصلاً ونصائح شخصية وخطة مذاكرة." },
  { icon: Clock, title: "خط زمني تفاعلي", text: "استكشف الأحداث التاريخية بصرياً واكتشف العلاقات بين الأسباب والنتائج." },
  { icon: Castle, title: "مملكتك التاريخية", text: "اكسب الذهب والنقاط وابنِ مملكتك وتنافس مع زملائك على المتصدرين." },
  { icon: MessageSquareText, title: "مساعد التدريس الذكي", text: "اسأل أي سؤال واحصل على إجابة بأسلوب الأستاذ خالد، مع أسئلة متابعة." },
  { icon: Target, title: "توقع الامتحان", text: "توقعات مبنية على امتحانات السنوات السابقة وأنماط أسئلة الأستاذ." },
  { icon: Sparkles, title: "محتوى الجنرال", text: "كل المواد من شرح وأسئلة من إعداد الأستاذ خالد هاشم شخصياً." },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

function DraggableTeacher() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);

  return (
    <div className="relative mx-auto mt-12 h-[420px] w-full max-w-lg select-none md:h-[520px]">
      {/* glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* drag hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-2 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur"
      >
        <Move className="h-3 w-3" /> اسحبني
      </motion.div>

      <motion.img
        src={teacherCutoutUrl}
        alt="الجنرال خالد هاشم"
        drag
        dragConstraints={{ top: -40, bottom: 40, left: -80, right: 80 }}
        dragElastic={0.4}
        whileTap={{ scale: 0.97, cursor: "grabbing" }}
        whileHover={{ scale: 1.02 }}
        style={{ x, y, rotate }}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: [0, -12, 0], scale: 1 }}
        transition={{
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative z-10 mx-auto h-full w-auto cursor-grab object-contain drop-shadow-2xl"
        draggable={false}
      />
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="border-b border-border/50 backdrop-blur sticky top-0 z-30 bg-background/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
<div className="h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-black">
  <img
  src={logo}
  alt="الجنرال خالد هاشم"
  className="h-full w-full object-contain p-0 scale-190"
/>
</div>
            <div className="text-lg font-bold">الجنرال خالد هاشم</div>
          </motion.div>
          <nav className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link to="/auth" search={{ mode: "signup" } as never}>
              <Button>ابدأ مجاناً</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent-foreground"
        >
          
        </motion.div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
        >
          تاريخ مصر بين يديك<br />
          <span className="text-accent">بأسلوب الجنرال خالد هاشم</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          مش مجرد دروس… تجربة تعليمية تفاعلية: خط زمني حي، مساعد ذكي يجيب بأسلوب الأستاذ، مملكة تبنيها بمذاكرتك، وتحليل دقيق لأدائك بعد كل امتحان.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link to="/auth" search={{ mode: "signup" } as never}>
            <Button size="lg" className="text-base">ابدأ رحلتك الآن</Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="text-base">تسجيل الدخول</Button>
          </Link>
        </motion.div>

        <DraggableTeacher />
      </section>

      {/* Showcase strip */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl"
          >
            <img src={teacherHeroUrl} alt="الجنرال خالد هاشم" className="h-72 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-4 right-4 left-4 text-right">
              <div className="text-xs font-semibold text-accent">في التاريخ والجغرافيا</div>
              <div className="text-xl font-black">الجنرال خالد هاشم</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl"
          >
            <img src={teacherGeneralUrl} alt="El General Khaled Hashem" className="h-72 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-4 right-4 left-4 text-right">
              <div className="text-xs font-semibold text-accent">EL GENERAL</div>
              <div className="text-xl font-black">شخصية تاريخية تشرح التاريخ</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <Card className="p-6 h-full transition hover:shadow-lg">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-accent/15 text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

    </div>
  );
}
