"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Users,
  Search,
  FlaskConical,
  BarChart3,
  DollarSign,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";

interface ValidationResult {
  idea: string;

  verdict?: {
    type?: "build" | "validate" | "rethink";
    label?: string;
  };

  overallAssessment?: {
    score?: number;
    summary?: string;
  };
}

interface ValidationBox {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  whatToDo: string;
  test: string;
  evidence: string;
  doneWhen: string;
  icon: React.ElementType;
}

export default function ValidationPlanPage() {
  const router = useRouter();

  const [result, setResult] =
    useState<ValidationResult | null>(null);

  const [openId, setOpenId] =
    useState<number | null>(null);

  const [completed, setCompleted] =
    useState<number[]>([]);

  useEffect(() => {
    const storedResult =
      sessionStorage.getItem("validationResult");

    if (!storedResult) {
      router.replace("/dashboard");
      return;
    }

    try {
      const parsed = JSON.parse(storedResult);

      setResult(parsed);

      const savedProgress =
        sessionStorage.getItem("validationProgress");

      if (savedProgress) {
        setCompleted(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error(
        "Unable to load validation plan:",
        error
      );

      router.replace("/test-idea");
    }
  }, [router]);

  const validationBoxes: ValidationBox[] = [
    {
      id: 1,
      title: "Find Your First Customer",
      subtitle: "Start with one specific user.",
      description:
        "Choose the first customer group you want to understand instead of targeting everyone.",
      whatToDo:
        "Define one customer type and speak with 5–10 real people from that group.",
      test:
        "Ask how they currently handle the problem.",
      evidence:
        "Repeated pain points, current solutions, and customer language.",
      doneWhen:
        "You can clearly describe who has the problem and why it matters.",
      icon: Users,
    },

    {
      id: 2,
      title: "Validate the Problem",
      subtitle: "Prove the problem is real.",
      description:
        "Do not validate the solution first. Make sure the problem is painful enough to solve.",
      whatToDo:
        "Talk to potential users without pitching your product.",
      test:
        "Ask when the problem last happened and what they did about it.",
      evidence:
        "Frequency, frustration, cost, time lost, or other real consequences.",
      doneWhen:
        "People describe the problem themselves and want a better solution.",
      icon: Search,
    },

    {
      id: 3,
      title: "Test Your Solution",
      subtitle: "Put something simple in front of users.",
      description:
        "You do not need a finished product. Test the smallest version that communicates your idea.",
      whatToDo:
        "Create a prototype, demo, landing page, or simple MVP.",
      test:
        "Show it to potential customers and observe their reaction.",
      evidence:
        "Questions, repeated interest, usability problems, and requested features.",
      doneWhen:
        "Users understand the value and can explain why they would use it.",
      icon: FlaskConical,
    },

    {
      id: 4,
      title: "Check the Market",
      subtitle: "Understand how people solve it today.",
      description:
        "A startup competes with existing products, services, habits, and even doing nothing.",
      whatToDo:
        "List direct competitors and alternative ways customers solve the problem.",
      test:
        "Compare features, pricing, experience, and distribution.",
      evidence:
        "Clear gaps, underserved users, or a meaningful differentiation.",
      doneWhen:
        "You can answer: 'Why would someone choose us instead?'",
      icon: BarChart3,
    },

    {
      id: 5,
      title: "Test the Business",
      subtitle: "Turn interest into real demand.",
      description:
        "Interest is useful, but payment or commitment is stronger evidence.",
      whatToDo:
        "Create a simple offer and test an initial price.",
      test:
        "Ask users to sign up, pre-order, pay, or commit to a pilot.",
      evidence:
        "Sign-ups, payments, pre-orders, pilot commitments, or strong buying intent.",
      doneWhen:
        "At least some target users show meaningful willingness to pay.",
      icon: DollarSign,
    },

    {
      id: 6,
      title: "Run a Real-World Pilot",
      subtitle: "Test the idea outside your laptop.",
      description:
        "Real-world conditions reveal problems that interviews and prototypes cannot.",
      whatToDo:
        "Run a small pilot with a limited number of real users.",
      test:
        "Measure whether users actually use the product and get value from it.",
      evidence:
        "Usage, retention, outcomes, feedback, failures, and repeat interest.",
      doneWhen:
        "Real users successfully use the product and produce measurable evidence.",
      icon: Rocket,
    },
  ];

  const toggleComplete = (id: number) => {
    setCompleted((previous) => {
      const updated = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      sessionStorage.setItem(
        "validationProgress",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  if (!result) {
    return (
      <main className="min-h-screen bg-[#E9E0D2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#D3C6B5] border-t-[#C99567] animate-spin" />

          <p className="mt-4 text-sm text-[#746C63]">
            Preparing your validation plan...
          </p>
        </div>
      </main>
    );
  }

  const completedCount = completed.filter((id) =>
    validationBoxes.some((box) => box.id === id)
  ).length;

  const progress = Math.round(
    (completedCount / validationBoxes.length) * 100
  );

  const verdictType =
    result.verdict?.type || "validate";

  const verdictLabel =
    verdictType === "build"
      ? "BUILD"
      : verdictType === "rethink"
      ? "RETHINK"
      : "VALIDATE MORE";

  const verdictDescription =
    verdictType === "build"
      ? "Your idea has enough early evidence to move toward an MVP and real-world pilot."
      : verdictType === "rethink"
      ? "Some important assumptions need to change before you invest heavily in building."
      : "Your idea is worth testing, but important assumptions still need real-world evidence.";

  return (
    <main className="min-h-screen bg-[#E9E0D2] text-[#29251F]">

      {/* HEADER */}

      <header className="h-[72px] bg-[#24211E] border-b border-[#39332D]">

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-full flex items-center justify-between">

          <button
            onClick={() => router.push("/results")}
            className="flex items-center gap-3 text-[#D8D0C5] hover:text-white transition"
          >
            <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
              <ArrowLeft size={16} />
            </div>

            <span className="hidden sm:block text-sm">
              Results
            </span>
          </button>

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-[#C99567] flex items-center justify-center">
              <Sparkles
                size={17}
                className="text-[#F8F3EB]"
              />
            </div>

            <div>
              <div className="text-sm font-semibold text-[#F8F3EB]">
                AI Startup Co-Pilot
              </div>

              <div className="text-[9px] uppercase tracking-[0.28em] text-[#B7AEA1]">
                Validation Plan
              </div>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-[#C99567]" />

            <span className="hidden sm:block text-xs text-[#B7AEA1]">
              Founder Mode
            </span>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <section className="max-w-[1180px] mx-auto px-5 lg:px-8 py-10">

        {/* HERO */}

        <div className="max-w-4xl">

          <div className="flex items-center gap-2 text-[#C99567]">

            <Target size={16} />

            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">
              From Idea to Evidence
            </span>

          </div>

          <h1 className="mt-3 text-4xl lg:text-5xl font-bold tracking-tight text-[#29251F]">
            What should you do next?
          </h1>

          <p className="mt-4 text-sm lg:text-base text-[#746C63] leading-7 max-w-3xl">
            Your AI validation tells you what looks promising.
            This plan helps you test it in the real world.
            Follow each step and collect evidence before making
            your next big decision.
          </p>

        </div>

        {/* IDEA + PROGRESS */}

        <div className="mt-8 grid lg:grid-cols-[1.5fr_0.5fr] gap-4">

          <div className="rounded-2xl border border-[#D3C6B5] bg-[#F8F3EB] p-5 lg:p-6">

            <div className="flex items-center gap-2 text-[#C99567]">

              <Lightbulb size={15} />

              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                Your Startup
              </span>

            </div>

            <p className="mt-3 text-sm lg:text-[15px] text-[#746C63] leading-7">
              {result.idea}
            </p>

          </div>

          <div className="rounded-2xl border border-[#D3C6B5] bg-[#EEE5D8] p-5 lg:p-6">

            <div className="text-[10px] uppercase tracking-[0.2em] text-[#9A9287]">
              Progress
            </div>

            <div className="mt-2 flex items-end justify-between">

              <span className="text-3xl font-bold text-[#29251F]">
                {progress}%
              </span>

              <span className="text-xs text-[#9A9287]">
                {completedCount}/6
              </span>

            </div>

            <div className="mt-4 h-1.5 bg-[#D3C6B5] rounded-full overflow-hidden">

              <div
                className="h-full bg-[#C99567] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* SECTION TITLE */}

        <div className="mt-10 mb-5">

          <div className="text-[10px] uppercase tracking-[0.22em] text-[#C99567] font-semibold">
            Real-World Validation
          </div>

          <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-[#29251F]">
            Six things to prove
          </h2>

          <p className="mt-2 text-sm text-[#746C63]">
            Do not try to prove everything at once. Move one
            step at a time and collect evidence.
          </p>

        </div>

        {/* 3 × 2 GRID */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

          {validationBoxes.map((box) => {

            const Icon = box.icon;

            const isCompleted =
              completed.includes(box.id);

            const isOpen =
              openId === box.id;

            return (
              <article
                key={box.id}
                className={`rounded-2xl border transition overflow-hidden ${
                  isCompleted
                    ? "border-[#718066]/30 bg-[#F1F1E9]"
                    : "border-[#D3C6B5] bg-[#F8F3EB]"
                }`}
              >

                <div className="p-5">

                  <div className="flex items-start justify-between">

                    <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D3C6B5] flex items-center justify-center">

                      {isCompleted ? (
                        <CheckCircle2
                          size={19}
                          className="text-[#718066]"
                        />
                      ) : (
                        <Icon
                          size={19}
                          className="text-[#C99567]"
                        />
                      )}

                    </div>

                    <span className="text-[10px] font-bold text-[#9A9287]">
                      0{box.id}
                    </span>

                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#29251F]">
                    {box.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#C99567]">
                    {box.subtitle}
                  </p>

                  <p className="mt-4 text-sm text-[#746C63] leading-6">
                    {box.description}
                  </p>

                  <button
                    onClick={() =>
                      setOpenId(
                        isOpen ? null : box.id
                      )
                    }
                    className="mt-5 w-full h-10 rounded-xl border border-[#D3C6B5] bg-[#EEE5D8] text-xs font-semibold text-[#403A33] hover:bg-[#E5D9C9] transition flex items-center justify-center gap-2"
                  >

                    {isOpen
                      ? "Hide Details"
                      : "View Details"}

                    <ChevronDown
                      size={14}
                      className={`transition ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                </div>

                {/* DETAILS */}

                {isOpen && (
                  <div className="border-t border-[#D3C6B5] bg-[#EEE5D8] p-5">

                    <div className="space-y-4">

                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#C99567]">
                          What to do
                        </div>

                        <p className="mt-1 text-xs text-[#746C63] leading-5">
                          {box.whatToDo}
                        </p>
                      </div>

                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#C99567]">
                          Test
                        </div>

                        <p className="mt-1 text-xs text-[#746C63] leading-5">
                          {box.test}
                        </p>
                      </div>

                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#C99567]">
                          Evidence
                        </div>

                        <p className="mt-1 text-xs text-[#746C63] leading-5">
                          {box.evidence}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#D3C6B5] bg-[#F8F3EB] p-3">

                        <div className="flex items-center gap-2">

                          <CheckCircle2
                            size={13}
                            className="text-[#718066]"
                          />

                          <span className="text-[9px] uppercase tracking-[0.16em] font-bold text-[#718066]">
                            Done when
                          </span>

                        </div>

                        <p className="mt-1 text-xs text-[#746C63] leading-5">
                          {box.doneWhen}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                <div className="px-5 pb-5">

                  <button
                    onClick={() =>
                      toggleComplete(box.id)
                    }
                    className={`w-full h-9 rounded-lg text-xs font-semibold transition ${
                      isCompleted
                        ? "bg-[#718066]/10 text-[#718066] border border-[#718066]/20"
                        : "bg-[#39332D] text-white hover:bg-[#24211E]"
                    }`}
                  >

                    {isCompleted
                      ? "✓ Completed"
                      : "Mark as Complete"}

                  </button>

                </div>

              </article>
            );
          })}

        </div>

        {/* FINAL RECOMMENDATION */}

        <section className="mt-8 rounded-2xl border border-[#39332D] bg-[#24211E] overflow-hidden shadow-[0_18px_45px_rgba(74,61,47,0.12)]">

          <div className="p-6 lg:p-8">

            <div className="flex flex-col lg:flex-row lg:items-center gap-7">

              {/* LEFT */}

              <div className="lg:w-[38%] shrink-0">

                <div className="flex items-center gap-2 text-[#C99567]">

                  <Sparkles size={16} />

                  <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">
                    Final Recommendation
                  </span>

                </div>

                <div className="mt-4 flex items-center gap-3">

                  <div className="px-3.5 py-1.5 rounded-full bg-[#C99567] text-[#F8F3EB] text-[11px] font-bold tracking-[0.12em]">
                    {verdictLabel}
                  </div>

                </div>

                <h2 className="mt-4 text-2xl lg:text-3xl font-bold text-[#F8F3EB]">
                  {verdictType === "build"
                    ? "Move toward your MVP."
                    : verdictType === "rethink"
                    ? "Rework before you build."
                    : "Prove it before you build."}
                </h2>

              </div>

              {/* RIGHT */}

              <div className="flex-1">

                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-5">

                  <p className="text-sm text-[#D8D0C5] leading-6">
                    {verdictDescription}
                  </p>

                  <div className="mt-5">

                    <div className="text-[9px] uppercase tracking-[0.18em] text-[#B7AEA1] font-semibold">
                      Your next focus
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-2">

                      <div className="flex items-center gap-2 text-xs text-[#E3DDD4]">
                        <span className="text-[#C99567]">01</span>
                        Talk to 5–10 target customers
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#E3DDD4]">
                        <span className="text-[#C99567]">02</span>
                        Test a simple MVP
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#E3DDD4]">
                        <span className="text-[#C99567]">03</span>
                        Measure real usage
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#E3DDD4]">
                        <span className="text-[#C99567]">04</span>
                        Check willingness to pay
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* DECISION RULE */}

            <div className="mt-6 pt-5 border-t border-white/10">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={14}
                    className="text-[#C99567]"
                  />

                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#B7AEA1]">
                    Decision Rule
                  </span>

                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">

                  <span className="px-2.5 py-1 rounded-lg bg-[#718066]/15 text-[#A9B79E]">
                    Strong evidence → BUILD
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#C99567]/15 text-[#D3B99A]">
                    Mixed evidence → VALIDATE MORE
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-[#8A5F50]/15 text-[#CBA99D]">
                    Weak evidence → RETHINK
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* NAVIGATION */}

        <div className="mt-8 pt-6 border-t border-[#D3C6B5] flex flex-col sm:flex-row justify-between gap-3">

          <button
            onClick={() => router.push("/results")}
            className="h-11 px-5 rounded-xl border border-[#D3C6B5] bg-[#F8F3EB] text-sm text-[#746C63] hover:text-[#29251F] hover:bg-[#EEE5D8] transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={15} />
            Back to Results
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem(
                "validationProgress"
              );

              router.push("/dashboard");
            }}
            className="h-11 px-6 rounded-xl bg-[#39332D] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#24211E] transition"
          >
            Test Another Idea
            <ArrowRight size={16} />
          </button>

        </div>

        {/* FOOTER */}

        <div className="py-8 text-center">

          <p className="text-[11px] text-[#9A9287]">
            AI Startup Co-Pilot • Evidence before execution.
          </p>

        </div>

      </section>

    </main>
  );
}