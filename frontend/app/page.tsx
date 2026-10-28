"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  const startValidation = () => {
    if (!idea.trim()) return;

    localStorage.setItem("startupIdea", idea.trim());
    router.push("/auth");
  };

  const scrollToAnalyzer = () => {
    document
      .getElementById("analyzer")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4EEE4] text-[#29251F]">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative z-50 border-b border-white/10 bg-[#24211E] text-[#F8F3EB]">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-6 lg:px-10">

          {/* BRAND */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C99567]/30 bg-[#C99567]/10">
              <span className="text-sm text-[#C99567]">✦</span>
            </div>

            <div>
              <div className="text-[15px] font-semibold tracking-[-0.02em]">
                AI Startup Co-Pilot
              </div>

              <div className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#B8B0A5]">
                Startup intelligence
              </div>
            </div>

          </div>

          {/* NAVIGATION */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push("/auth")}
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-[#E9E0D2] transition hover:border-[#C99567]/50 hover:bg-white/5"
            >
              Login
            </button>

            <button
              onClick={scrollToAnalyzer}
              className="hidden rounded-full bg-[#C99567] px-5 py-2 text-sm font-semibold text-[#24211E] transition hover:bg-[#D6AA7D] sm:block"
            >
              Analyze an idea
            </button>

          </div>
        </div>
      </header>


      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative min-h-[700px] overflow-hidden">

        {/* WARM BACKGROUND */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-[180px] top-[80px] h-[600px] w-[600px] rounded-full bg-[#C99567]/16 blur-[150px]" />

          <div className="absolute right-[-220px] top-[-150px] h-[650px] w-[650px] rounded-full bg-[#D8B38E]/20 blur-[160px]" />

          <div className="absolute left-[38%] top-[40%] h-[420px] w-[420px] rounded-full bg-[#E2C9A9]/20 blur-[150px]" />

          <div className="absolute left-[15%] top-[25%] h-32 w-32 animate-pulse rounded-full bg-[#B88960]/10 blur-[80px]" />

          <div
            className="absolute bottom-[15%] right-[18%] h-40 w-40 animate-pulse rounded-full bg-[#C99567]/10 blur-[90px]"
            style={{ animationDelay: "1.8s" }}
          />

        </div>


        {/* BACKGROUND DIMENSIONS */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A98A6C]/10" />

          <div className="absolute left-1/2 top-1/2 h-[650px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A98A6C]/[0.06]" />

          <BackgroundDimension
            text="MARKET OPPORTUNITY"
            className="left-[4%] top-[18%]"
            delay="0s"
          />

          <BackgroundDimension
            text="CUSTOMER PROBLEM"
            className="right-[7%] top-[20%]"
            delay="1.2s"
          />

          <BackgroundDimension
            text="COMPETITION"
            className="left-[9%] top-[55%]"
            delay="2.4s"
          />

          <BackgroundDimension
            text="BUSINESS MODEL"
            className="right-[5%] top-[56%]"
            delay="0.8s"
          />

          <BackgroundDimension
            text="MARKET TIMING"
            className="left-[22%] bottom-[8%]"
            delay="1.8s"
          />

          <BackgroundDimension
            text="RISKS & OPPORTUNITIES"
            className="right-[20%] bottom-[7%]"
            delay="3s"
          />

        </div>


        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto grid min-h-[700px] max-w-[1380px] items-center gap-14 px-6 py-20 lg:grid-cols-[1fr_0.85fr] lg:px-10">

          {/* LEFT */}

          <div className="relative max-w-[650px]">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#A98A6C]/25 bg-[#FFF9F0]/65 px-4 py-2 backdrop-blur-md">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B88960]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#806E5D]">
                AI-powered startup intelligence
              </span>

            </div>


            <h1 className="max-w-[650px] text-[50px] font-semibold leading-[0.98] tracking-[-0.045em] text-[#29251F] sm:text-[62px] lg:text-[74px]">

              Build with confidence.

              <span className="mt-2 block text-[#9A7655]">
                Not assumptions.
              </span>

            </h1>


            <p className="mt-7 max-w-[570px] text-[17px] leading-7 text-[#746C63]">

              Is your idea worth building?

              <span className="block">
                Get a clear AI-powered validation report before you spend your
                time, money, and energy building it.
              </span>

            </p>


            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">

              <Feature number="01" text="Market analysis" />
              <Feature number="02" text="Customer insight" />
              <Feature number="03" text="Risk evaluation" />

            </div>


            <div className="mt-10 flex items-center gap-3 text-xs text-[#9A9287]">

              <div className="flex -space-x-1">

                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F4EEE4] bg-[#D8C4AE] text-[9px] text-[#594D42]">
                  AI
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F4EEE4] bg-[#BFA58B] text-[9px] text-white">
                  ✓
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F4EEE4] bg-[#8E7963] text-[9px] text-white">
                  ✦
                </span>

              </div>

              <span>
                Six perspectives. One clearer decision.
              </span>

            </div>

          </div>


          {/* RIGHT ANALYZER */}

          <div
            id="analyzer"
            className="relative z-30 lg:justify-self-end"
          >

            <div className="absolute -inset-8 rounded-[42px] bg-[#B88960]/10 blur-3xl" />


            <div className="relative w-full max-w-[500px] overflow-hidden rounded-[30px] border border-[#C8B7A3]/50 bg-[#FFFDF9]/95 p-7 shadow-[0_30px_80px_rgba(73,55,39,0.13)] backdrop-blur-xl sm:p-8">

              {/* CARD HEADER */}

              <div className="flex items-start justify-between border-b border-[#D8CEC2] pb-6">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#29251F] text-sm text-[#D4A579]">
                      ✦
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A8568]">
                      AI Idea Analyzer
                    </span>

                  </div>

                  <h2 className="mt-5 text-[28px] font-semibold tracking-[-0.03em] text-[#29251F]">
                    Tell us your idea.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#8A8178]">
                    We'll help you understand whether it's worth building.
                  </p>

                </div>


                <div className="flex items-center gap-1.5 rounded-full border border-[#D8CEC2] bg-[#F7F1E8] px-3 py-1.5">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9B795A]" />

                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8B7968]">
                    AI Ready
                  </span>

                </div>

              </div>


              {/* TEXTAREA */}

              <div className="mt-7">

                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#62594F]">
                  Your startup idea
                </label>

                <div className="relative mt-3">

                  <textarea
                    value={idea}
                    onChange={(e) =>
                      setIdea(e.target.value.slice(0, 2000))
                    }
                    placeholder="Example: An AI platform that helps small businesses..."
                    className="min-h-[190px] w-full resize-none rounded-2xl border border-[#D8CEC2] bg-[#FAF6F0] p-5 text-sm leading-6 text-[#29251F] outline-none transition placeholder:text-[#A9A096] focus:border-[#B88960] focus:bg-white"
                  />

                  <div className="absolute bottom-4 right-4 rounded-md bg-[#FFFDF9]/80 px-2 py-1 text-[10px] text-[#9A9287]">
                    {idea.length}/2000
                  </div>

                </div>

                <p className="mt-3 text-xs text-[#9A9287]">
                  More context helps the AI generate a stronger report.
                </p>

              </div>


              {/* BUTTON */}

              <button
                type="button"
                onClick={startValidation}
                disabled={!idea.trim()}
                className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#29251F] py-4 text-sm font-semibold text-[#F8F3EB] shadow-[0_12px_30px_rgba(41,37,31,0.18)] transition hover:-translate-y-0.5 hover:bg-[#3A342D] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >

                <span>
                  Analyze My Idea
                </span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>

              </button>


              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#9A9287]">

                <span className="text-[#A47C5A]">
                  ✦
                </span>

                <span>
                  Your idea will be evaluated across six perspectives
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          VALIDATION FRAMEWORK
      ========================================================= */}

      <section className="relative overflow-hidden border-t border-[#D8CEC2] bg-[#EEE5D8] px-6 py-24">

        {/* BACKGROUND DECOR */}

        <div className="pointer-events-none absolute left-[-180px] top-[20%] h-[450px] w-[450px] rounded-full bg-[#C99567]/10 blur-[130px]" />

        <div className="pointer-events-none absolute right-[-180px] bottom-[10%] h-[450px] w-[450px] rounded-full bg-[#D8B38E]/15 blur-[140px]" />


        <div className="relative mx-auto max-w-[1380px]">

          <div className="max-w-[720px]">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7655]">
              The validation framework
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#29251F] sm:text-5xl">
              Six questions every founder should ask.
            </h2>

            <p className="mt-5 max-w-[650px] text-base leading-7 text-[#746C63]">
              Your final report evaluates the idea from six different
              perspectives to give you a more complete picture of its
              potential.
            </p>

          </div>


          {/* =====================================================
              3 × 2 GRID
          ===================================================== */}

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            <FrameworkCard
              number="01"
              title="Market Opportunity"
              description="Is the market large enough and is there real demand?"
              type="market"
            />

            <FrameworkCard
              number="02"
              title="Customer Problem"
              description="Does your idea solve a meaningful customer problem?"
              type="customer"
            />

            <FrameworkCard
              number="03"
              title="Competition"
              description="Who already exists and how can you differentiate?"
              type="competition"
            />

            <FrameworkCard
              number="04"
              title="Business Model"
              description="Can this become a sustainable business?"
              type="business"
            />

            <FrameworkCard
              number="05"
              title="Market Timing"
              description="Why is this the right time for the idea?"
              type="timing"
            />

            <FrameworkCard
              number="06"
              title="Risks & Opportunities"
              description="What risks exist and where are the biggest opportunities?"
              type="risk"
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section className="relative border-t border-[#D8CEC2] bg-[#F4EEE4] px-6 py-24">

        <div className="mx-auto max-w-[1380px]">

          <div className="max-w-[650px]">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7655]">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#29251F] sm:text-5xl">
              From idea to clarity.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#746C63]">
              A simple three-step process designed to help you make a better
              startup decision.
            </p>

          </div>


          <div className="mt-14 grid gap-5 md:grid-cols-3">

            <StepCard
              number="01"
              title="Describe"
              description="Tell us what you are building, who it is for, and the problem you want to solve."
            />

            <StepCard
              number="02"
              title="Analyze"
              description="Our AI evaluates your idea across market, customer, competition, business and risk perspectives."
            />

            <StepCard
              number="03"
              title="Decide"
              description="Receive a clear validation report to help you build, improve, pivot or rethink."
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#24211E] px-6 py-24 text-[#F8F3EB]">

        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-[#C99567]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1000px] text-center">

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C99567]">
            Your next idea starts here
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">

            Don't just build what

            <span className="block text-[#C99567]">
              sounds good.
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-[600px] text-base leading-7 text-[#B8B0A5]">
            Build what the opportunity tells you is worth building.
          </p>

          <button
            onClick={scrollToAnalyzer}
            className="mt-9 rounded-full bg-[#C99567] px-8 py-4 text-sm font-semibold text-[#24211E] transition hover:-translate-y-0.5 hover:bg-[#D6AA7D]"
          >
            Test My Idea →
          </button>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-[#3A3530] bg-[#24211E] px-6 py-7 text-[#8F877D]">

        <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-3 text-xs sm:flex-row">

          <span>
            ✦ AI Startup Co-Pilot © 2026
          </span>

          <span>
            Your AI co-pilot for smarter startup decisions.
          </span>

        </div>

      </footer>

    </main>
  );
}


/* =============================================================
   BACKGROUND DIMENSION
============================================================= */

function BackgroundDimension({
  text,
  className,
  delay,
}: {
  text: string;
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute ${className} animate-[floatDimension_7s_ease-in-out_infinite]`}
      style={{ animationDelay: delay }}
    >
      <div className="relative">

        <div className="absolute -inset-6 rounded-full bg-[#C99567]/[0.04] blur-2xl" />

        <span className="relative whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.25em] text-[#806E5D]/25 sm:text-[10px]">
          {text}
        </span>

      </div>
    </div>
  );
}


/* =============================================================
   FEATURE
============================================================= */

function Feature({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span className="text-[9px] font-semibold tracking-wider text-[#A47C5A]">
        {number}
      </span>

      <span className="text-xs font-medium text-[#746C63]">
        {text}
      </span>

    </div>
  );
}


/* =============================================================
   FRAMEWORK CARD
============================================================= */

function FrameworkCard({
  number,
  title,
  description,
  type,
}: {
  number: string;
  title: string;
  description: string;
  type: string;
}) {
  return (
    <div className="group relative min-h-[260px] overflow-hidden rounded-[26px] border border-[#D2C6B8] bg-[#F8F3EB] p-7 shadow-[0_12px_35px_rgba(73,55,39,0.04)] transition duration-500 hover:-translate-y-1 hover:border-[#BFA487] hover:shadow-[0_22px_55px_rgba(73,55,39,0.10)]">

      {/* CARD NUMBER */}

      <div className="flex items-center justify-between">

        <span className="text-xs font-semibold tracking-[0.15em] text-[#9A7655]">
          {number}
        </span>

        <span className="text-[#B8A694] transition duration-300 group-hover:translate-x-1 group-hover:text-[#9A7655]">
          ↗
        </span>

      </div>


      {/* DIFFERENT VISUALS */}

      {type === "market" && (
        <div className="absolute right-6 top-16 opacity-30">
          <div className="h-24 w-24 rounded-full border border-[#B88960]" />
          <div className="absolute inset-3 rounded-full border border-[#B88960]" />
          <div className="absolute inset-7 rounded-full bg-[#C99567]/20" />
        </div>
      )}


      {type === "customer" && (
        <div className="absolute right-7 top-16 flex items-center gap-1 opacity-30">
          <div className="h-8 w-8 rounded-full border border-[#B88960]" />
          <div className="h-px w-10 bg-[#B88960]" />
          <div className="h-5 w-5 rounded-full bg-[#C99567]/40" />
        </div>
      )}


      {type === "competition" && (
        <div className="absolute right-7 top-16 space-y-2 opacity-30">
          <div className="h-2 w-24 rounded-full bg-[#B88960]/40" />
          <div className="h-2 w-16 rounded-full bg-[#B88960]/30" />
          <div className="h-2 w-10 rounded-full bg-[#B88960]/60" />
        </div>
      )}


      {type === "business" && (
        <div className="absolute right-7 top-14 opacity-30">
          <svg
            width="100"
            height="70"
            viewBox="0 0 100 70"
            fill="none"
          >
            <path
              d="M5 60L28 45L45 50L70 25L95 8"
              stroke="#A47C5A"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}


      {type === "timing" && (
        <div className="absolute right-7 top-16 flex items-center gap-2 opacity-30">
          <div className="h-px w-20 bg-[#B88960]" />
          <div className="h-3 w-3 rounded-full bg-[#A47C5A]" />
          <span className="text-[8px] font-semibold tracking-widest text-[#806E5D]">
            NOW
          </span>
        </div>
      )}


      {type === "risk" && (
        <div className="absolute right-7 top-14 flex gap-2 opacity-30">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#B88960] text-xs">
            −
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C99567]/20 text-xs">
            +
          </div>
        </div>
      )}


      {/* CONTENT */}

      <div className="relative z-10 mt-20 max-w-[85%]">

        <h3 className="text-[21px] font-semibold tracking-[-0.025em] text-[#29251F]">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#746C63]">
          {description}
        </p>

      </div>


      {/* BOTTOM ACCENT */}

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C99567] transition-all duration-500 group-hover:w-full" />

    </div>
  );
}


/* =============================================================
   STEP CARD
============================================================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-[24px] border border-[#D2C6B8] bg-[#F8F3EB] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(73,55,39,0.09)]">

      <div className="flex items-center justify-between">

        <span className="text-sm font-semibold text-[#9A7655]">
          {number}
        </span>

        <span className="text-lg text-[#C5B5A4] transition group-hover:text-[#9A7655]">
          ↗
        </span>

      </div>

      <h3 className="mt-9 text-2xl font-semibold tracking-[-0.03em] text-[#29251F]">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-[#746C63]">
        {description}
      </p>

    </div>
  );
}


/* =============================================================
   ANIMATION
============================================================= */

const style = `
@keyframes floatDimension {
  0%, 100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.55;
  }

  50% {
    transform: translate3d(0, -10px, 0);
    opacity: 0.9;
  }
}
`;

if (typeof document !== "undefined") {
  const existing = document.getElementById(
    "ai-copilot-background-animation"
  );

  if (!existing) {
    const styleElement = document.createElement("style");
    styleElement.id = "ai-copilot-background-animation";
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  }
}