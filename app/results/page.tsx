"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Download,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  Clock3,
  Sparkles,
  Zap,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type Dimension = {
  score?: number;
  title?: string;
  assessment?: string;
  strengths?: string[];
  concerns?: string[];
  risks?: string[];
  opportunities?: string[];
};

type ValidationResult = {
  idea?: string;

  verdict?: {
    type?: "build" | "validate" | "rethink" | string;
    label?: string;
    explanation?: string;
  };

  overallAssessment?: {
    score?: number;
    summary?: string;
  };

  dimensions?: {
    marketOpportunity?: Dimension;
    customerProblem?: Dimension;
    competition?: Dimension;
    businessModel?: Dimension;
    marketTiming?: Dimension;
    risksAndOpportunities?: Dimension;
  };

  founderBrief?: {
    concept?: string;
    targetCustomer?: string;
    coreProblem?: string;
    valueProposition?: string;
    biggestStrength?: string;
    biggestConcern?: string;
  };

  improvementSuggestions?: string[];

  actionPlan?: {
    priority?: number;
    action?: string;
    reason?: string;
  }[];
};

/* ============================================================
   HELPERS
   ============================================================ */

function getScore(value: unknown): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.max(
      0,
      Math.min(10, Number(value.toFixed(1)))
    );
  }

  return 0;
}

function getText(
  value: unknown,
  fallback = "Information unavailable."
): string {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return fallback;
}

function getArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string" &&
      item.trim().length > 0
  );
}

function scoreLabel(score: number) {
  if (score >= 8.5) return "Excellent";
  if (score >= 7) return "Strong";
  if (score >= 6) return "Promising";
  if (score >= 5) return "Moderate";
  if (score >= 3) return "Weak";
  return "Very Weak";
}

function scoreWidth(score: number) {
  return `${Math.max(
    0,
    Math.min(100, score * 10)
  )}%`;
}

/* ============================================================
   DIMENSION CARD
   ============================================================ */

function DimensionCard({
  icon: Icon,
  number,
  name,
  dimension,
}: {
  icon: any;
  number: string;
  name: string;
  dimension?: Dimension;
}) {
  const score = getScore(dimension?.score);

  const strengths = getArray(
    dimension?.strengths
  );

  const concerns = getArray(
    dimension?.concerns
  );

  return (
    <article className="group rounded-2xl border border-[#D7CBBB] bg-[#F8F3EB] p-6 lg:p-7 shadow-[0_14px_40px_rgba(74,61,47,0.06)] hover:border-[#C5AF97] hover:shadow-[0_18px_45px_rgba(74,61,47,0.10)] transition">

      {/* TOP */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-[#EEE5D8] border border-[#D7CBBB] flex items-center justify-center">

            <Icon
              size={18}
              className="text-[#A86F45]"
            />

          </div>

          <div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-[#A86F45] font-semibold">
              {number}
            </p>

            <h3 className="mt-1 text-[16px] font-bold text-[#403A33]">
              {name}
            </h3>

          </div>

        </div>

        <div className="text-right">

          <p className="text-2xl font-bold text-[#29251F]">
            {score}
          </p>

          <p className="text-[10px] uppercase tracking-wider text-[#968A7D]">
            / 10
          </p>

        </div>

      </div>

      {/* SCORE BAR */}

      <div className="mt-5">

        <div className="h-1.5 w-full rounded-full bg-[#E4D9CA] overflow-hidden">

          <div
            className="h-full rounded-full bg-[#B98255] transition-all"
            style={{
              width: scoreWidth(score),
            }}
          />

        </div>

        <div className="mt-2 flex justify-between">

          <span className="text-[11px] text-[#968A7D]">
            {scoreLabel(score)}
          </span>

          <span className="text-[11px] text-[#968A7D]">
            {score.toFixed(1)} / 10
          </span>

        </div>

      </div>

      {/* TITLE */}

      <h4 className="mt-6 text-[15px] font-semibold text-[#403A33]">
        {getText(
          dimension?.title,
          name
        )}
      </h4>

      {/* ASSESSMENT */}

      <p className="mt-2.5 text-[13px] text-[#746C63] leading-6">
        {getText(
          dimension?.assessment,
          "This area requires further validation."
        )}
      </p>

      {/* STRENGTHS */}

      {strengths.length > 0 && (
        <div className="mt-5">

          <p className="text-[10px] uppercase tracking-[0.16em] text-[#7E9173] font-semibold">
            Strengths
          </p>

          <div className="mt-2.5 space-y-2">

            {strengths
              .slice(0, 3)
              .map((item, index) => (

                <div
                  key={index}
                  className="flex gap-2.5"
                >

                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-[#7E9173]"
                  />

                  <p className="text-[12px] text-[#746C63] leading-5">
                    {item}
                  </p>

                </div>

              ))}

          </div>

        </div>
      )}

      {/* CONCERNS */}

      {concerns.length > 0 && (
        <div className="mt-5 pt-5 border-t border-[#E0D5C7]">

          <p className="text-[10px] uppercase tracking-[0.16em] text-[#A86F45] font-semibold">
            Watch closely
          </p>

          <div className="mt-2.5 space-y-2">

            {concerns
              .slice(0, 2)
              .map((item, index) => (

                <div
                  key={index}
                  className="flex gap-2.5"
                >

                  <CircleAlert
                    size={14}
                    className="mt-0.5 shrink-0 text-[#A86F45]"
                  />

                  <p className="text-[12px] text-[#746C63] leading-5">
                    {item}
                  </p>

                </div>

              ))}

          </div>

        </div>
      )}

    </article>
  );
}

/* ============================================================
   RESULTS PAGE
   ============================================================ */

export default function ResultsPage() {

  const router = useRouter();

  const [result, setResult] =
    useState<ValidationResult | null>(
      null
    );

  const [idea, setIdea] = useState("");

  const [loading, setLoading] =
    useState(true);

  /* ==========================================================
     LOAD RESULT
     ========================================================== */

  useEffect(() => {

    try {

      const storedResult =
        sessionStorage.getItem(
          "validationResult"
        );

      const storedIdea =
        sessionStorage.getItem(
          "startupIdea"
        );

      if (storedResult) {

        const parsed =
          JSON.parse(storedResult);

        setResult(parsed);

      }

      if (storedIdea) {
        setIdea(storedIdea);
      }

    } catch (error) {

      console.error(
        "Unable to load validation result:",
        error
      );

    } finally {

      setLoading(false);

    }

  }, []);

  /* ==========================================================
     DERIVED DATA
     ========================================================== */

  const finalIdea = useMemo(
    () =>
      getText(
        result?.idea,
        idea || "Your Startup Idea"
      ),
    [result, idea]
  );

  const overallScore = getScore(
    result?.overallAssessment?.score
  );

  const verdictType =
    result?.verdict?.type ||
    "validate";

  const verdictLabel = getText(
    result?.verdict?.label,
    "Validate Before Building"
  );

  const verdictExplanation = getText(
    result?.verdict?.explanation,
    "The idea is worth exploring, but important assumptions should be validated before building the full product."
  );

  const overallSummary = getText(
    result?.overallAssessment?.summary,
    "The idea has potential, but its most important assumptions should be tested with real customers."
  );

  const founder = result?.founderBrief;

  const improvements = getArray(
    result?.improvementSuggestions
  );

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-[#E9E0D2] flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto w-10 h-10 rounded-full border-2 border-[#C9B9A7] border-t-[#A86F45] animate-spin" />

          <p className="mt-5 text-[14px] text-[#746C63]">
            Preparing your startup analysis...
          </p>

        </div>

      </div>

    );

  }

  /* ==========================================================
     NO RESULT
     ========================================================== */

  if (!result) {

    return (

      <div className="min-h-screen bg-[#E9E0D2] flex items-center justify-center px-6">

        <div className="max-w-md w-full rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-9 text-center shadow-[0_25px_70px_rgba(74,61,47,0.10)]">

          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

            <CircleAlert
              size={25}
              className="text-[#A45F4C]"
            />

          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#29251F]">
            No validation found
          </h1>

          <p className="mt-3 text-[14px] text-[#746C63] leading-6">
            Your validation result could not be
            found. Start a new analysis from the
            dashboard.
          </p>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="mt-7 w-full min-h-[50px] rounded-xl bg-[#2B2723] hover:bg-[#39332D] text-[#F8F3EB] font-semibold text-[14px] flex items-center justify-center gap-2 transition"
          >

            Back to Dashboard

            <ArrowRight size={17} />

          </button>

        </div>

      </div>

    );

  }

  /* ==========================================================
     MAIN
     ========================================================== */

  return (

    <div className="min-h-screen bg-[#E9E0D2] text-[#29251F]">

      {/* ======================================================
          TOP DARK HEADER
          ====================================================== */}

      <header className="sticky top-0 z-50 bg-[#24211E] border-b border-[#39342E] shadow-[0_8px_30px_rgba(36,33,30,0.16)]">

        <div className="max-w-[1450px] mx-auto px-5 lg:px-10">

          <div className="h-[76px] flex items-center justify-between gap-5">

            {/* BRAND */}

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="flex items-center gap-3 group"
            >

              <div className="w-10 h-10 rounded-xl bg-[#312D29] border border-[#685A4C] flex items-center justify-center">

                <Sparkles
                  size={18}
                  className="text-[#D3A77D]"
                />

              </div>

              <div className="hidden sm:block text-left">

                <p className="text-[15px] font-bold text-[#F4EEE5]">
                  AI Startup
                </p>

                <p className="text-[15px] font-bold text-[#C99567]">
                  Co-Pilot
                </p>

              </div>

            </button>

            {/* ACTIONS */}

            <div className="flex items-center gap-2.5">

              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="min-h-[42px] px-4 rounded-xl border border-[#51483E] bg-[#2B2723] hover:bg-[#39332D] text-[#D9D0C6] text-[12px] font-semibold flex items-center gap-2 transition"
              >

                <ArrowLeft size={15} />

                <span className="hidden sm:inline">
                  Back to Dashboard
                </span>

              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="min-h-[42px] px-4 rounded-xl bg-[#F0E8DC] hover:bg-[#F8F3EB] text-[#403A33] text-[12px] font-semibold flex items-center gap-2 transition"
              >

                <Download size={15} />

                <span className="hidden sm:inline">
                  Download Report
                </span>

              </button>

            </div>

          </div>

        </div>

      </header>

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <main className="relative overflow-hidden">

        {/* BACKGROUND */}

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -top-56 right-[-180px] w-[650px] h-[650px] rounded-full bg-[#C99567]/10 blur-[160px]" />

          <div className="absolute top-[900px] left-[-220px] w-[600px] h-[600px] rounded-full bg-[#B8A68F]/12 blur-[160px]" />

          <div className="absolute bottom-[-200px] right-[10%] w-[500px] h-[500px] rounded-full bg-white/20 blur-[170px]" />

        </div>

        <div className="relative z-10 max-w-[1450px] mx-auto px-5 lg:px-10 py-10 lg:py-14">

          {/* ==================================================
              PAGE INTRO
              ================================================== */}

          <div className="mb-8">

            <div className="flex items-center gap-2 text-[#A86F45]">

              <BrainCircuit size={16} />

              <span className="text-[11px] uppercase tracking-[0.24em] font-semibold">
                Startup Validation Report
              </span>

            </div>

            <p className="mt-3 text-[13px] text-[#968A7D]">
              Your idea has been evaluated across six
              decision areas.
            </p>

          </div>

          {/* ==================================================
              1. DECISION HEADER
              ================================================== */}

          <section className="relative rounded-[28px] overflow-hidden border border-[#4B433B] bg-[#2B2723] text-[#F8F3EB] shadow-[0_28px_80px_rgba(55,45,36,0.18)]">

            <div className="absolute top-0 left-0 right-0 h-px bg-[#C99567]/60" />

            <div className="relative p-7 md:p-9 lg:p-11">

              <div className="grid xl:grid-cols-[1.35fr_0.65fr] gap-9 xl:gap-12">

                {/* LEFT */}

                <div>

                  <div className="flex items-center gap-2.5">

                    <div className="w-9 h-9 rounded-lg bg-[#39332D] border border-[#51483E] flex items-center justify-center">

                      <Lightbulb
                        size={17}
                        className="text-[#D3A77D]"
                      />

                    </div>

                    <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#C99567]">
                      Decision Header
                    </span>

                  </div>

                  <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-[#F8F3EB] max-w-4xl">
                    {finalIdea}
                  </h1>

                  <p className="mt-5 max-w-3xl text-[14px] lg:text-[15px] text-[#BEB5AA] leading-7">
                    {overallSummary}
                  </p>

                  {/* VERDICT */}

                  <div className="mt-7 rounded-2xl border border-[#51483E] bg-[#332E29] p-5 lg:p-6">

                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          verdictType === "build"
                            ? "bg-[#5A684F]/30 border border-[#718065]"
                            : verdictType === "rethink"
                            ? "bg-[#714F43]/30 border border-[#806054]"
                            : "bg-[#725D46]/30 border border-[#8A7459]"
                        }`}
                      >

                        {verdictType ===
                        "build" ? (

                          <CheckCircle2
                            size={20}
                            className="text-[#AFC0A3]"
                          />

                        ) : verdictType ===
                          "rethink" ? (

                          <CircleAlert
                            size={20}
                            className="text-[#D29A86]"
                          />

                        ) : (

                          <Zap
                            size={20}
                            className="text-[#D3A77D]"
                          />

                        )}

                      </div>

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#9E958A] font-semibold">
                          Recommended Decision
                        </p>

                        <h2 className="mt-1.5 text-xl lg:text-2xl font-bold text-[#F8F3EB]">
                          {verdictLabel}
                        </h2>

                        <p className="mt-2 text-[13px] text-[#BEB5AA] leading-6 max-w-3xl">
                          {verdictExplanation}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* SCORE */}

                <div className="xl:border-l xl:border-[#4B433B] xl:pl-10 flex flex-col justify-center">

                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#9E958A] font-semibold">
                    Overall Score
                  </p>

                  <div className="mt-3 flex items-end gap-3">

                    <span className="text-7xl lg:text-8xl font-bold tracking-tight text-[#F8F3EB] leading-none">
                      {overallScore}
                    </span>

                    <span className="pb-2 text-[16px] text-[#8F867C]">
                      / 10
                    </span>

                  </div>

                  <p className="mt-3 text-[13px] text-[#C99567] font-semibold">
                    {scoreLabel(overallScore)}
                  </p>

                  <div className="mt-6 h-2 rounded-full bg-[#403A34] overflow-hidden">

                    <div
                      className="h-full rounded-full bg-[#C99567]"
                      style={{
                        width: scoreWidth(
                          overallScore
                        ),
                      }}
                    />

                  </div>

                  <div className="mt-3 flex justify-between text-[10px] text-[#81786F]">

                    <span>
                      Needs work
                    </span>

                    <span>
                      Strong opportunity
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              2. SIX DIMENSIONS
              ================================================== */}

          <section className="mt-12">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

              <div>

                <div className="flex items-center gap-2 text-[#A86F45]">

                  <Target size={16} />

                  <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                    Six Decision Dimensions
                  </span>

                </div>

                <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#29251F]">
                  What is driving the decision?
                </h2>

              </div>

              <p className="max-w-md text-[13px] text-[#746C63] leading-6">
                Each dimension highlights what looks strong,
                what needs attention, and where uncertainty
                remains.
              </p>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

              <DimensionCard
                icon={TrendingUp}
                number="01"
                name="Market Opportunity"
                dimension={
                  result.dimensions
                    ?.marketOpportunity
                }
              />

              <DimensionCard
                icon={Users}
                number="02"
                name="Customer Problem"
                dimension={
                  result.dimensions
                    ?.customerProblem
                }
              />

              <DimensionCard
                icon={Target}
                number="03"
                name="Competition"
                dimension={
                  result.dimensions?.competition
                }
              />

              <DimensionCard
                icon={BriefcaseBusiness}
                number="04"
                name="Business Model"
                dimension={
                  result.dimensions
                    ?.businessModel
                }
              />

              <DimensionCard
                icon={Clock3}
                number="05"
                name="Market Timing"
                dimension={
                  result.dimensions
                    ?.marketTiming
                }
              />

              <DimensionCard
                icon={ShieldCheck}
                number="06"
                name="Risks & Opportunities"
                dimension={
                  result.dimensions
                    ?.risksAndOpportunities
                }
              />

            </div>

          </section>

          {/* ==================================================
              3. FOUNDER SNAPSHOT
              ================================================== */}

          <section className="mt-12 rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] overflow-hidden shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

            <div className="p-7 lg:p-10">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center shrink-0">

                  <BrainCircuit
                    size={20}
                    className="text-[#A86F45]"
                  />

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#A86F45] font-semibold">
                    Founder Snapshot
                  </p>

                  <h2 className="mt-2 text-3xl lg:text-4xl font-bold text-[#29251F]">
                    See your idea clearly.
                  </h2>

                  <p className="mt-2 text-[14px] text-[#746C63]">
                    A concise view of the business behind your
                    idea.
                  </p>

                </div>

              </div>

              <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">

                {[
                  {
                    label: "Concept",
                    value: founder?.concept,
                    icon: Lightbulb,
                  },
                  {
                    label: "Target Customer",
                    value:
                      founder?.targetCustomer,
                    icon: Users,
                  },
                  {
                    label: "Core Problem",
                    value:
                      founder?.coreProblem,
                    icon: CircleAlert,
                  },
                  {
                    label: "Value Proposition",
                    value:
                      founder?.valueProposition,
                    icon: Sparkles,
                  },
                  {
                    label: "Biggest Strength",
                    value:
                      founder?.biggestStrength,
                    icon: TrendingUp,
                  },
                  {
                    label: "Biggest Concern",
                    value:
                      founder?.biggestConcern,
                    icon: ShieldCheck,
                  },
                ].map(
                  ({
                    label,
                    value,
                    icon: Icon,
                  }) => (

                    <div
                      key={label}
                      className="rounded-2xl border border-[#D7CBBB] bg-[#EEE5D8] p-5"
                    >

                      <div className="flex items-center gap-2.5">

                        <Icon
                          size={16}
                          className="text-[#A86F45]"
                        />

                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#968A7D] font-semibold">
                          {label}
                        </p>

                      </div>

                      <p className="mt-3 text-[13px] text-[#403A33] leading-6">
                        {getText(
                          value,
                          "Not enough information yet."
                        )}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>

          {/* ==================================================
              4. IMPROVEMENT OPPORTUNITIES
              ================================================== */}

          <section className="mt-12">

            <div className="mb-6">

              <div className="flex items-center gap-2 text-[#A86F45]">

                <Zap size={16} />

                <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                  Improvement Opportunities
                </span>

              </div>

              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-[#29251F]">
                How to make this idea stronger.
              </h2>

              <p className="mt-2 text-[14px] text-[#746C63]">
                Focus on the changes that can improve the idea
                before you invest heavily.
              </p>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

              {(
                improvements.length > 0
                  ? improvements
                  : [
                      "Start with one clearly defined customer group.",
                      "Find a clear reason customers would switch.",
                      "Test demand before building the full product.",
                    ]
              )
                .slice(0, 4)
                .map(
                  (suggestion, index) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-[#D7CBBB] bg-[#F8F3EB] p-6 shadow-[0_14px_40px_rgba(74,61,47,0.05)]"
                    >

                      <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                          <Lightbulb
                            size={18}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <span className="text-[10px] font-mono text-[#A99D90]">
                          0{index + 1}
                        </span>

                      </div>

                      <p className="mt-6 text-[14px] font-semibold text-[#403A33] leading-6">
                        {suggestion}
                      </p>

                    </div>

                  )
                )}

            </div>

          </section>

          {/* ==================================================
              5. REAL-WORLD VALIDATION CTA
              ================================================== */}

          <section className="mt-12 rounded-[28px] border border-[#D3C6B5] bg-[#F0E8DC] overflow-hidden shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

            <div className="relative p-7 lg:p-10">

              <div className="absolute top-0 left-0 right-0 h-px bg-[#C99567]/60" />

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                {/* LEFT */}

                <div className="max-w-3xl">

                  <div className="flex items-center gap-2 text-[#A86F45]">

                    <Target size={16} />

                    <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                      Real-World Validation
                    </span>

                  </div>

                  <h2 className="mt-3 text-2xl lg:text-3xl font-bold text-[#29251F]">
                    Ready to test this idea in the real world?
                  </h2>

                  <p className="mt-3 text-[14px] text-[#746C63] leading-6 max-w-2xl">
                    This analysis gives you a starting point.
                    Now turn it into evidence by testing
                    customers, demand, competition, pricing,
                    and your solution before investing heavily.
                  </p>

                  {/* VALIDATION FLOW */}

                  <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-[#746C63]">

                    <span className="px-3 py-1.5 rounded-lg bg-[#F8F3EB] border border-[#D7CBBB]">
                      Test
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-[#A86F45]"
                    />

                    <span className="px-3 py-1.5 rounded-lg bg-[#F8F3EB] border border-[#D7CBBB]">
                      Collect Evidence
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-[#A86F45]"
                    />

                    <span className="px-3 py-1.5 rounded-lg bg-[#F8F3EB] border border-[#D7CBBB]">
                      Decide
                    </span>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="shrink-0">

                  <button
                    onClick={() =>
                      router.push(
                        "/validation-Roadmap"
                      )
                    }
                    className="min-h-[52px] px-7 rounded-xl bg-[#2B2723] hover:bg-[#39332D] text-[#F8F3EB] font-bold text-[13px] flex items-center justify-center gap-2 transition shadow-[0_10px_25px_rgba(43,39,35,0.15)]"
                  >

                    Open Validation Roadmap

                    <ArrowRight size={16} />

                  </button>

                  <p className="mt-2 text-center text-[10px] text-[#968A7D]">
                    Turn AI insights into real-world evidence
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              6. FINAL CTA
              ================================================== */}

          <section className="mt-12 rounded-[28px] bg-[#2B2723] border border-[#4B433B] overflow-hidden shadow-[0_25px_70px_rgba(55,45,36,0.15)]">

            <div className="p-8 lg:p-11 text-center">

              <div className="mx-auto w-12 h-12 rounded-xl bg-[#39332D] border border-[#5A5046] flex items-center justify-center">

                <Sparkles
                  size={20}
                  className="text-[#D3A77D]"
                />

              </div>

              <h2 className="mt-5 text-2xl lg:text-3xl font-bold text-[#F8F3EB]">
                Ready to test another idea?
              </h2>

              <p className="mt-3 text-[14px] text-[#BEB5AA]">
                Keep challenging assumptions before you build.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">

                <button
                  onClick={() =>
                    router.push("/dashboard")
                  }
                  className="min-h-[50px] px-7 rounded-xl bg-[#F0E8DC] hover:bg-[#F8F3EB] text-[#403A33] font-bold text-[13px] flex items-center gap-2 transition"
                >

                  Test Another Idea

                  <ArrowRight size={16} />

                </button>

                <button
                  onClick={() =>
                    router.push("/dashboard")
                  }
                  className="min-h-[50px] px-7 rounded-xl border border-[#5A5046] hover:bg-[#39332D] text-[#D9D0C6] font-semibold text-[13px] flex items-center gap-2 transition"
                >

                  <ArrowLeft size={16} />

                  Dashboard

                </button>

              </div>

              <p className="mt-8 text-[11px] text-[#81786F]">
                AI Startup Co-Pilot • Validate before you build.
              </p>

            </div>

          </section>

          {/* FOOTER */}

          <div className="py-8 text-center">

            <p className="text-[12px] text-[#968A7D]">
              AI Startup Co-Pilot • Your thinking partner for
              better startup decisions.
            </p>

          </div>

        </div>

      </main>

      {/* PRINT STYLING */}

      <style jsx global>{`

        @media print {

          header {
            position: static !important;
          }

          button {
            display: none !important;
          }

          body {
            background: white !important;
          }

          section {
            break-inside: avoid;
          }

        }

      `}</style>

    </div>

  );
}