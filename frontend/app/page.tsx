"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#171717]">
      {/* ==================== NAVIGATION ==================== */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717]">
              <span className="text-xl text-[#A7D8B8]">
                ✦
              </span>
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                IdeaProof
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                Know before you build
              </div>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="hidden items-center gap-8 text-sm text-black/55 md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-black"
            >
              How it works
            </a>

            <a
              href="#framework"
              className="transition hover:text-black"
            >
              Framework
            </a>

            <a
              href="#why"
              className="transition hover:text-black"
            >
              Why IdeaProof
            </a>
          </nav>

          {/* NAV CTA */}
          <button
            onClick={() =>
              document
                .getElementById("validator")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-full bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#276749]"
          >
            Test an idea
          </button>
        </div>
      </header>


      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#276749]/10" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-[#276749]/10" />


        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:pb-32 lg:pt-28">


          {/* ==================== LEFT HERO ==================== */}
          <div>

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-black/55">

              <span className="h-2 w-2 rounded-full bg-[#276749]" />

              AI-powered startup intelligence

            </div>


            {/* Main Heading */}
            <h1 className="max-w-3xl font-serif text-6xl leading-[0.92] tracking-[-0.045em] md:text-7xl lg:text-8xl">

              Is your idea

              <span className="block text-[#276749]">
                worth building?
              </span>

            </h1>


            {/* Description */}
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/55">

              Find out before you build it. Get an AI-powered reality check
              on your market, customers, competitors, business model, and
              biggest risks.

            </p>


            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() =>
                  document
                    .getElementById("validator")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full bg-[#171717] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#276749]"
              >
                Test My Idea →
              </button>


              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border border-black/15 bg-white/50 px-7 py-4 text-sm font-medium transition hover:bg-white"
              >
                See how it works
              </button>

            </div>


            {/* Validation Signals */}
            <div className="mt-10">

              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-black/35">
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
                    className="rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-xs text-black/50"
                  >
                    {item}
                  </span>

                ))}

              </div>

            </div>

          </div>


          {/* ==================== RIGHT SIDE VALIDATION FORM ==================== */}
          <div id="validator">

            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-8">


              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-black/10 pb-6">

                <div>

                  <p className="text-xs uppercase tracking-[0.18em] text-black/35">
                    New validation
                  </p>


                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Let's test your idea.
                  </h2>

                </div>


                {/* Logo Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F2EC] text-xl text-[#276749]">

                  ✦

                </div>

              </div>


              {/* ==================== IDEA INPUT ==================== */}
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
                  className="mt-3 min-h-36 w-full resize-none rounded-2xl border border-black/10 bg-[#F8F8F6] p-5 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-[#276749] focus:ring-4 focus:ring-[#276749]/10"
                />


                {/* Character Count */}
                <div className="mt-3 flex justify-between text-xs text-black/35">

                  <span>
                    More context helps AI generate better insights.
                  </span>

                  <span>
                    {idea.length}/2000
                  </span>

                </div>

              </div>


              {/* ==================== ADDITIONAL INPUTS ==================== */}
              <div className="mt-7 grid gap-4 sm:grid-cols-2">


                {/* Target Customer */}
                <div>

                  <label className="text-xs font-semibold text-black/60">
                    Target customer
                  </label>


                  <input
                    placeholder="Who is it for?"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-[#F8F8F6] px-4 py-3 text-sm outline-none transition focus:border-[#276749]"
                  />

                </div>


                {/* Industry */}
                <div>

                  <label className="text-xs font-semibold text-black/60">
                    Industry
                  </label>


                  <input
                    placeholder="e.g. FinTech"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-[#F8F8F6] px-4 py-3 text-sm outline-none transition focus:border-[#276749]"
                  />

                </div>

              </div>


              {/* ==================== START VALIDATION BUTTON ==================== */}
              <button
                disabled={!idea.trim()}
                className="mt-7 w-full rounded-xl bg-[#171717] py-4 text-sm font-semibold text-white transition hover:bg-[#276749] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Start AI Validation →
              </button>


              {/* Small helper text */}
              <p className="mt-4 text-center text-xs text-black/30">
                Turn your idea into a clear validation report.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="how-it-works"
        className="border-t border-black/10 bg-white px-6 py-24 lg:px-10"
      >

        <div className="mx-auto max-w-7xl">


          {/* Section Heading */}
          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#276749]">
              How IdeaProof works
            </p>


            <h2 className="mt-5 font-serif text-5xl leading-tight tracking-tight md:text-6xl">

              From idea

              <br />

              to clarity.

            </h2>


            <p className="mt-6 text-lg leading-8 text-black/50">

              IdeaProof transforms an early-stage idea into a structured
              validation report using AI-powered analysis.

            </p>

          </div>


          {/* Three Steps */}
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


      {/* ==================== VALIDATION FRAMEWORK ==================== */}
      <section
        id="framework"
        className="border-t border-black/10 bg-[#F5F4F0] px-6 py-24 lg:px-10"
      >

        <div className="mx-auto max-w-7xl">


          {/* Framework Heading */}
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">


            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#276749]">
                The validation framework
              </p>


              <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-tight tracking-tight md:text-6xl">

                Six questions

                <br />

                every founder should ask.

              </h2>

            </div>


            <p className="max-w-md text-sm leading-6 text-black/50">

              A startup idea is more than a good concept. IdeaProof looks at
              the signals that determine whether an opportunity is worth
              pursuing.

            </p>

          </div>


          {/* Six Framework Cards */}
          <div className="mt-16 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">


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


      {/* ==================== FINAL CTA ==================== */}
      <section
        id="why"
        className="bg-[#171717] px-6 py-24 text-white lg:px-10"
      >

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row md:items-end">


          <div>

            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Your next idea starts here
            </p>


            <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-tight tracking-tight md:text-7xl">

              Don't just build

              <br />

              what sounds good.

            </h2>


            <p className="mt-6 max-w-lg text-lg leading-8 text-white/45">

              Build what the opportunity tells you is worth building.

            </p>

          </div>


          {/* Final CTA Button */}
          <button
            onClick={() =>
              document
                .getElementById("validator")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-fit rounded-full bg-[#A7D8B8] px-8 py-4 text-sm font-semibold text-[#171717] transition hover:bg-white"
          >
            Test My Idea →
          </button>


        </div>

      </section>


      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#171717] px-6 pb-10 text-white lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 border-t border-white/10 pt-8 text-sm text-white/35 md:flex-row">


          <div className="flex items-center gap-2">

            <span className="text-[#A7D8B8]">
              ✦
            </span>

            <span>
              IdeaProof © 2026
            </span>

          </div>


          <span>
            Know before you build.
          </span>


        </div>

      </footer>

    </main>
  );
}


/* ========================================================= */
/* STEP CARD COMPONENT */
/* ========================================================= */

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
    <div className="rounded-3xl border border-black/10 bg-[#F5F4F0] p-8 transition hover:-translate-y-1 hover:shadow-lg">


      {/* Number */}
      <span className="text-xs font-semibold tracking-[0.2em] text-[#276749]">
        {number}
      </span>


      {/* Title */}
      <h3 className="mt-10 text-2xl font-semibold">
        {title}
      </h3>


      {/* Description */}
      <p className="mt-4 text-sm leading-7 text-black/50">
        {description}
      </p>


    </div>
  );
}


/* ========================================================= */
/* FRAMEWORK CARD COMPONENT */
/* ========================================================= */

function FrameworkCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-r border-black/10 p-8 transition hover:bg-white md:p-10">


      {/* Number */}
      <span className="text-xs font-semibold tracking-widest text-[#276749]">
        {number}
      </span>


      {/* Title */}
      <h3 className="mt-10 text-xl font-semibold">
        {title}
      </h3>


      {/* Description */}
      <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
        {description}
      </p>


    </div>
  );
}