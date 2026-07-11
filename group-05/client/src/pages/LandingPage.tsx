import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileClock,
  History,
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/bimbingan-1-1600.webp";
import collaborationImage from "../assets/images/bimbingan-2-1600.webp";
import collaborationImageSmall from "../assets/images/bimbingan-2-800.webp";
import workspaceImage from "../assets/images/bimbingan-3-1600.webp";
import workspaceImageSmall from "../assets/images/bimbingan-3-800.webp";
import { Brand } from "../components/layout/brand";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button-variants";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";

const features = [
  {
    title: "Academic eligibility first",
    description: "Official account, SKS, PI, Sar-Mag, and supervisor assignment checks are surfaced before booking.",
    icon: ShieldCheck
  },
  {
    title: "Supervisor availability",
    description: "Students view generated supervision slots from assigned lecturers without manual schedule negotiation.",
    icon: CalendarCheck
  },
  {
    title: "Approval workflow",
    description: "Every request enters pending review before becoming a confirmed thesis supervision session.",
    icon: ClipboardCheck
  },
  {
    title: "Documented sessions",
    description: "Notes, feedback, revision uploads, and supervision history stay connected to the approved session.",
    icon: FileClock
  }
];

const studentFlow = [
  { title: "Login", description: "Sign in with your official Gunadarma student account." },
  { title: "Dashboard", description: "See eligibility, supervisors, and upcoming sessions at a glance." },
  { title: "Book Supervision", description: "Pick an open slot from your supervisor and send a request." }
];

const lecturerFlow = [
  { title: "Login", description: "Sign in with your official Gunadarma staff account." },
  { title: "Review Requests", description: "See pending booking requests alongside today's schedule." },
  { title: "Approve", description: "Confirm, document, and notify -- the session is on record." }
];

const benefits = [
  "No double-booking or overlapping sessions",
  "Every session documented -- never lost in chat",
  "Automatic in-app and email notifications",
  "Recurring lecturer schedules, with exceptions"
];

const aboutItems = [
  { icon: History, title: "Permanent History", text: "Completed supervision records remain accessible for future review." },
  {
    icon: BellRing,
    title: "Notification Ready",
    text: "Booking decisions, schedule updates, reminders, revisions, and feedback trigger updates."
  },
  {
    icon: ShieldCheck,
    title: "System Managed",
    text: "Academic data and supervisor assignments are consumed from external university systems."
  }
];

function FlowTrack({ label, steps }: { label: string; steps: { title: string; description: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <div className="mt-3 grid gap-3">
        {steps.map((step, index) => (
          <div key={step.title} className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {index + 1}
            </span>
            <div className="pt-0.5">
              <p className="text-sm font-bold tracking-tight">{step.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const reveal = {
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div className="min-h-svh bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-white/88 backdrop-blur dark:bg-background/86">
        <div className="section-shell flex h-16 items-center justify-between">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex" aria-label="Landing navigation">
            <a href="#features" className="transition-colors duration-150 hover:text-foreground">
              Features
            </a>
            <a href="#process" className="transition-colors duration-150 hover:text-foreground">
              Workflow
            </a>
            <a href="#about" className="transition-colors duration-150 hover:text-foreground">
              About
            </a>
          </nav>
          <Link to="/login" className={buttonVariants({ size: "sm" })}>
            Login
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden pt-16">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/50 to-slate-950/20" />
          <div className="section-shell relative z-10 pb-14 pt-24 text-white md:pb-20">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <Badge className="border-white/20 bg-white/12 text-white">Thesis Supervision Scheduling</Badge>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight md:text-display">
                Gunadarma Thesis Guidance Scheduling System
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/86 md:text-lg">
                A focused academic platform for appointment booking, lecturer availability, supervision documentation, revision
                history, and notification workflows at Universitas Gunadarma.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className={cn(buttonVariants({ size: "lg" }), "bg-white text-primary hover:bg-white/92")}>
                  Access GTGS
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "border-white/35 bg-white/8 text-white hover:bg-white/15"
                  })}
                >
                  Explore Modules
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="border-b bg-background py-16">
          <div className="section-shell">
            <motion.div className="mb-8 max-w-2xl" {...reveal}>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Core Modules</p>
              <h2 className="mt-3 font-display text-h2 font-bold tracking-tight">Built for the thesis supervision lifecycle.</h2>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardContent className="p-6">
                      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-display text-base font-bold tracking-tight">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="process" className="bg-muted/35 py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div {...reveal}>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">How GTGS Works</p>
              <h2 className="mt-3 font-display text-h2 font-bold tracking-tight">
                Every task finishes in three steps or fewer.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Students and lecturers each have a short, predictable path -- no complex navigation to learn.
              </p>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <FlowTrack label="Student Flow" steps={studentFlow} />
                <FlowTrack label="Lecturer Flow" steps={lecturerFlow} />
              </div>
            </motion.div>
            <motion.img
              src={collaborationImage}
              srcSet={`${collaborationImageSmall} 800w, ${collaborationImage} 1600w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Students discussing supervision with a lecturer"
              className="aspect-[16/10] w-full rounded-xl object-cover shadow-panel"
              {...reveal}
            />
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.img
              src={workspaceImage}
              srcSet={`${workspaceImageSmall} 800w, ${workspaceImage} 1600w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Thesis documents reviewed during guidance"
              className="aspect-[16/10] w-full rounded-xl object-cover shadow-panel"
              {...reveal}
            />
            <motion.div {...reveal}>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Benefits</p>
              <h2 className="mt-3 font-display text-h2 font-bold tracking-tight">A calmer way to coordinate guidance.</h2>
              <div className="mt-7 grid gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-tight">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ["2", "roles only"],
                  ["144", "minimum SKS"],
                  ["H-1", "session reminders"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border bg-muted/35 p-4">
                    <div className="font-display text-2xl font-bold text-primary">{value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="border-y bg-muted/35 py-16">
          <div className="section-shell grid gap-5 md:grid-cols-3">
            {aboutItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="rounded-xl border bg-card p-6 shadow-sm"
                  {...reveal}
                  transition={{ ...reveal.transition, delay: shouldReduceMotion ? 0 : index * 0.08 }}
                >
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="bg-primary py-12 text-primary-foreground">
          <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-h2 font-bold tracking-tight">Ready to manage thesis guidance with GTGS?</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">Use your official Gunadarma account to continue.</p>
            </div>
            <Link to="/login" className={cn(buttonVariants({ size: "lg" }), "bg-warm text-warm-foreground shadow-sm hover:bg-warm/90")}>
              Login to GTGS
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-background py-8">
        <div className="section-shell flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <Brand />
          <p>Gunadarma Thesis Guidance Scheduling System. Built for academic supervision workflows.</p>
        </div>
      </footer>
    </div>
  );
}
