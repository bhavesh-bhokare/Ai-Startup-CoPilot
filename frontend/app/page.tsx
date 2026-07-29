"use client";

import { useState } from "react";

export default function Home() {
const [idea, setIdea] = useState("");

return ( <main className="min-h-screen bg-[#0B0B0D] text-[#F5F1E8]">

```
  {/* NAVBAR */}
  <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0D]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF6A]/30 bg-[#D4AF6A]/10">
          <span className="text-xl text-[#D4AF6A]">✦</span>
        </div>

        <div>
          <div className="font-serif text-xl font-semibold">
            AI Startup Co-Pilot
          </div>

          <div className="text-[9px] uppercase tracking-[0.2em] text-white/35">
            Your AI co-pilot for smarter startup decisions
          </div>
        </div>
      </div>

      <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
        <a href="#how-it-works" className="transition hover:text-[#D4AF6A]">
          How it works
        </a>

        <a href="#framework" className="transition hover:text-[#D4AF6A]">
          Framework
        </a>

        <a href="#why" className="transition hover:text-[#D4AF6A]">
          Why us
        </a>
      </nav>

      <button
        onClick={() =>
          document
            .getElementById("validator")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="rounded-full bg-[#D4AF6A] px-5 py-2.5 text-sm font-semibold text-[#0B0B0D] transition hover:bg-[#E8C987]"
      >
        Test an idea
      </button>
    </div>
  </header>

  {/* HERO */}
  <section className="relative overflow-hidden">

    <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#D4AF6A]/10 blur-[120px]" />

    <div className="pointer-events-none absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[140px]" />

    <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-28 pt-24 lg:grid-cols-2 lg:items-center lg:px-10 lg:pb-36 lg:pt-32">

      {/* LEFT SIDE */}
      <div>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF6A]/20 bg-[#D4AF6A]/5 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#D4AF6A]">

          <span className="h-2 w-2 rounded-full bg-[#D4AF6A]" />

          AI-powered startup intelligence

        </div>

        <h1 className="max-w-3xl font-serif text-6xl leading-[0.9] tracking-[-0.04em] md:text-7xl lg:text-8xl">

          Is your idea

          <span className="block bg-gradient-to-r from-[#D4AF6A] via-[#F0D79B] to-[#B88A3B] bg-clip-text text-transparent">
            worth building?
          </span>

        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-white/50">

          Find out before you build it. Get an AI-powered reality check
          on your market, customers, competitors, business model, and
          biggest risks.

        </p>

        <div className="mt-10 flex flex-wrap gap-4">

          <button
            onClick={() =>
              document
                .getElementById("validator")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-full bg-[#D4AF6A] px-7 py-4 text-sm font-semibold text-[#0B0B0D] transition hover:bg-[#E8C987]"
          >
            Test My Idea →
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm text-white/80 transition hover:bg-white/10"
          >
            See how it works
          </button>

        </div>

        <div className="mt-10">

          <p className="mb-3 text-xs uppercase tracking-widest text-white/30">
            One idea · Multiple signals
          </p>

          <div className="flex flex-wrap gap-2">

            {[
              "Market",
              "Demand",
              "Competition",
              "Business Model",
              "Risk",
            ].map((item) => (

              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/45"
              >
                {item}
              </span>

            ))}

          </div>

        </div>

      </div>

      {/* VALIDATION CARD */}
      <div id="validator">

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">

          <div className="flex items-center justify-between border-b border-white/10 pb-6">

            <div>

              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                New validation
              </p>

              <h2 className="mt-2 font-serif text-3xl">
                Let's test your idea.
              </h2>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF6A]/25 bg-[#D4AF6A]/10 text-xl text-[#D4AF6A]">
              ✦
            </div>

          </div>

          <div className="mt-7">

            <label className="text-sm font-semibold">
              What are you building?
            </label>

            <textarea
              value={idea}
              onChange={(e) =>
                setIdea(e.target.value.slice(0, 2000))
              }
              placeholder="Describe your startup idea in a few sentences..."
              className="mt-3 min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#D4AF6A]/50"
            />

            <div className="mt-3 flex justify-between text-xs text-white/25">

              <span>
                More context helps AI generate better insights.
              </span>

              <span>
                {idea.length}/2000
              </span>

            </div>

          </div>

         

<p className="mt-4 text-center text-xs text-white/25">
  Turn your idea into a clear validation report.
</p>

          <button
            disabled={!idea.trim()}
            className="mt-7 w-full rounded-xl bg-[#D4AF6A] py-4 text-sm font-semibold text-[#0B0B0D] transition hover:bg-[#E8C987] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Start AI Validation →
          </button>

          <p className="mt-4 text-center text-xs text-white/25">
            Turn your idea into a clear validation report.
          </p>

        </div>

      </div>

    </div>

  </section>

  {/* HOW IT WORKS */}
  <section
    id="how-it-works"
    className="border-t border-white/10 bg-[#101014] px-6 py-24 lg:px-10"
  >

    <div className="mx-auto max-w-7xl">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF6A]">
        How AI Startup Co-Pilot works
      </p>

      <h2 className="mt-5 font-serif text-5xl md:text-6xl">
        From idea
        <br />
        to clarity.
      </h2>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/45">
        AI Startup Co-Pilot transforms an early-stage idea into a
        structured validation report using AI-powered analysis.
      </p>

      <div className="mt-16 grid gap-5 md:grid-cols-3">

        <StepCard
          number="01"
          title="Describe"
          description="Tell us what you're building, who it's for, and what problem you're solving."
        />

        <StepCard
          number="02"
          title="Analyze"
          description="Our AI evaluates your idea across market, customer, competition, business model, and risk signals."
        />

        <StepCard
          number="03"
          title="Decide"
          description="Get a structured report that helps you decide whether to build, pivot, or rethink."
        />

      </div>

    </div>

  </section>

  {/* FRAMEWORK */}
  <section
    id="framework"
    className="border-t border-white/10 bg-[#0B0B0D] px-6 py-24 lg:px-10"
  >

    <div className="mx-auto max-w-7xl">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF6A]">
        The validation framework
      </p>

      <h2 className="mt-5 font-serif text-5xl md:text-6xl">
        Six questions
        <br />
        every founder should ask.
      </h2>

      <div className="mt-16 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">

        <FrameworkCard
          number="01"
          title="Market Opportunity"
          description="Is the market large enough and is there meaningful demand?"
        />

        <FrameworkCard
          number="02"
          title="Customer Problem"
          description="Does your idea solve a real problem that people care about?"
        />

        <FrameworkCard
          number="03"
          title="Competition"
          description="Who is already solving this problem and where can you differentiate?"
        />

        <FrameworkCard
          number="04"
          title="Business Model"
          description="Can your idea become a sustainable and scalable business?"
        />

        <FrameworkCard
          number="05"
          title="Market Timing"
          description="Why now? Is the market ready for your solution?"
        />

        <FrameworkCard
          number="06"
          title="Risks & Opportunities"
          description="What could stop you and where are the biggest opportunities?"
        />

      </div>

    </div>

  </section>

  {/* FINAL CTA */}
  <section
    id="why"
    className="border-t border-white/10 bg-[#101014] px-6 py-24"
  >

    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row md:items-end">

      <div>

        <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">
          Your next idea starts here
        </p>

        <h2 className="mt-5 font-serif text-5xl md:text-7xl">
          Don't just build
          <br />
          what sounds good.
        </h2>

        <p className="mt-6 max-w-lg text-lg text-white/40">
          Build what the opportunity tells you is worth building.
        </p>

      </div>

      <button
        onClick={() =>
          document
            .getElementById("validator")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="w-fit rounded-full bg-[#D4AF6A] px-8 py-4 text-sm font-semibold text-[#0B0B0D] transition hover:bg-[#E8C987]"
      >
        Test My Idea →
      </button>

    </div>

  </section>

  {/* FOOTER */}
  <footer className="bg-[#0B0B0D] px-6 pb-10">

    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-t border-white/10 pt-8 text-sm text-white/30 md:flex-row">

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

/* STEP CARD */

function StepCard({
number,
title,
description,
}: {
number: string;
title: string;
description: string;
}) {
return ( <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 transition hover:-translate-y-1 hover:border-[#D4AF6A]/30">

```
  <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF6A]">
    {number}
  </span>

  <h3 className="mt-10 font-serif text-3xl">
    {title}
  </h3>

  <p className="mt-4 text-sm leading-7 text-white/40">
    {description}
  </p>

</div>

);
}

/* FRAMEWORK CARD */

function FrameworkCard({
number,
title,
description,
}: {
number: string;
title: string;
description: string;
}) {
return ( <div className="border-b border-r border-white/10 p-8 transition hover:bg-white/[0.035] md:p-10">


  <span className="text-xs font-semibold tracking-widest text-[#D4AF6A]">
    {number}
  </span>

  <h3 className="mt-10 font-serif text-2xl">
    {title}
  </h3>

  <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
    {description}
  </p>

</div>

);
}
