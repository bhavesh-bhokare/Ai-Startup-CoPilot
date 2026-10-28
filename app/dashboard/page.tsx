"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  User,
} from "firebase/auth";



import {
  LayoutDashboard,
  BarChart3,
  History,
  Settings,
  UserCircle,
  LogOut,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  BrainCircuit,
  Activity,
  Zap,
  Clock3,
  CircleAlert,
  Trophy,
  Gauge,
  Check,
  LockKeyhole,
  Mail,
  KeyRound,
  SlidersHorizontal,
  Monitor,
  Save,
  Shield,
} from "lucide-react";

type HistoryItem = {
  id: string;
  idea?: string;
  startupIdea?: string;
  score?: number;
  overallScore?: number;
  verdict?: string;
  overallVerdict?: string;
  summary?: string;
  overallSummary?: string;
  createdAt?: string | null;
  dimensions?: Record<string, any>;
  actionPlan?: any[];
  result?: any;
  validationResult?: any;
  [key: string]: any;
};

type ViewType =
  | "dashboard"
  | "analytics"
  | "history"
  | "settings";

type SettingsTab =
  | "profile"
  | "preferences"
  | "security";

type DimensionKey =
  | "marketOpportunity"
  | "customerProblem"
  | "competition"
  | "businessModel"
  | "marketTiming"
  | "risksAndOpportunities";

const DIMENSIONS: {
  key: DimensionKey;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    key: "marketOpportunity",
    title: "Market Opportunity",
    description: "Market demand, size, and potential.",
    icon: TrendingUp,
  },
  {
    key: "customerProblem",
    title: "Customer Problem",
    description: "Strength and importance of the problem.",
    icon: Users,
  },
  {
    key: "competition",
    title: "Competition",
    description: "Competitive landscape and differentiation.",
    icon: Target,
  },
  {
    key: "businessModel",
    title: "Business Model",
    description: "Ability to create a sustainable business.",
    icon: Gauge,
  },
  {
    key: "marketTiming",
    title: "Market Timing",
    description: "Why the opportunity makes sense now.",
    icon: Clock3,
  },
  {
    key: "risksAndOpportunities",
    title: "Risks & Opportunities",
    description: "Major risks and potential upside.",
    icon: ShieldCheck,
  },
];

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeView, setActiveView] =
    useState<ViewType>("dashboard");

  const [historyData, setHistoryData] =
    useState<HistoryItem[]>([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState("");

  const [settingsTab, setSettingsTab] =
    useState<SettingsTab>("profile");

  const [appearance, setAppearance] =
    useState<"system" | "light">("light");

  const [defaultView, setDefaultView] =
    useState<
      "dashboard" | "analytics" | "history"
    >("dashboard");

  const [validationExperience, setValidationExperience] =
    useState<"detailed" | "balanced">("detailed");

  const [preferencesSaved, setPreferencesSaved] =
    useState(false);

  const [passwordResetLoading, setPasswordResetLoading] =
    useState(false);

  const [securityMessage, setSecurityMessage] =
    useState("");

  /*
  ============================================================
  FIREBASE AUTHENTICATION
  ============================================================
  */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null);
          setAuthLoading(false);
          router.replace("/auth");
          return;
        }

        try {
          /*
          Refresh the Firebase user so that
          emailVerified has the latest value.
          */
          await currentUser.reload();

          const refreshedUser = auth.currentUser;

          if (!refreshedUser) {
            setUser(null);
            setAuthLoading(false);
            router.replace("/auth");
            return;
          }

          /*
          ========================================================
          EMAIL VERIFICATION SECURITY CHECK
          ========================================================
          */

          if (!refreshedUser.emailVerified) {
            setUser(null);
            setAuthLoading(false);

            await signOut(auth);

            router.replace("/auth?verify=true");
            return;
          }

          /*
          ========================================================
          VERIFIED USER
          ========================================================
          */

          setUser(refreshedUser);
          setAuthLoading(false);
        } catch (error) {
          console.error(
            "Authentication verification error:",
            error
          );

          setUser(null);
          setAuthLoading(false);

          try {
            await signOut(auth);
          } catch (signOutError) {
            console.error(
              "Unable to sign out:",
              signOutError
            );
          }

          router.replace("/auth");
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  /*
  ============================================================
  LOAD PREFERENCES
  ============================================================
  */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "startupCopilotPreferences"
      );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (
        parsed.appearance === "system" ||
        parsed.appearance === "light"
      ) {
        setAppearance(parsed.appearance);
      }

      if (
        parsed.defaultView === "dashboard" ||
        parsed.defaultView === "analytics" ||
        parsed.defaultView === "history"
      ) {
        setDefaultView(parsed.defaultView);
      }

      if (
        parsed.validationExperience === "detailed" ||
        parsed.validationExperience === "balanced"
      ) {
        setValidationExperience(
          parsed.validationExperience
        );
      }
    } catch (error) {
      console.error(
        "Unable to load preferences:",
        error
      );
    }
  }, []);

  /*
  ============================================================
  SAVE PREFERENCES
  ============================================================
  */

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        "startupCopilotPreferences",
        JSON.stringify({
          appearance,
          defaultView,
          validationExperience,
        })
      );

      setPreferencesSaved(true);

      setTimeout(() => {
        setPreferencesSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Unable to save preferences:",
        error
      );
    }
  };

  /*
  ============================================================
  LOAD USER HISTORY
  ============================================================
  */

  const loadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("/auth");
        return;
      }

      const token =
        await currentUser.getIdToken();

      const response = await fetch(
        "/api/history",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to load validation history."
        );
      }

      setHistoryData(
        Array.isArray(data.history)
          ? data.history
          : []
      );
    } catch (error) {
      console.error(
        "History loading error:",
        error
      );

      setHistoryError(
        error instanceof Error
          ? error.message
          : "Unable to load validation history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  /*
  ============================================================
  LOAD HISTORY WHEN NEEDED
  ============================================================
  */

  useEffect(() => {
    if (
      activeView === "history" ||
      activeView === "analytics"
    ) {
      loadHistory();
    }
  }, [activeView]);

  /*
  ============================================================
  COMPLETE RESULT
  ============================================================
  */

  const getCompleteHistoryResult = (
    item: HistoryItem
  ) => {
    if (
      item.result &&
      typeof item.result === "object"
    ) {
      return {
        ...item,
        ...item.result,
      };
    }

    if (
      item.validationResult &&
      typeof item.validationResult === "object"
    ) {
      return {
        ...item,
        ...item.validationResult,
      };
    }

    return item;
  };

  /*
  ============================================================
  GET HISTORY IDEA
  ============================================================
  */

  const getHistoryIdea = (
    item: HistoryItem
  ) => {
    return (
      item.idea ||
      item.startupIdea ||
      item.result?.idea ||
      item.result?.startupIdea ||
      item.validationResult?.idea ||
      item.validationResult?.startupIdea ||
      "Startup idea"
    );
  };

  /*
  ============================================================
  OPEN HISTORY RESULT
  ============================================================
  */

  const handleOpenHistory = (
    item: HistoryItem
  ) => {
    try {
      const completeResult =
        getCompleteHistoryResult(item);

      sessionStorage.setItem(
        "validationResult",
        JSON.stringify(completeResult)
      );

      const historyIdea =
        getHistoryIdea(item);

      if (historyIdea) {
        sessionStorage.setItem(
          "startupIdea",
          historyIdea
        );
      }

      sessionStorage.setItem(
        "validationSource",
        "history"
      );

      router.push("/results");
    } catch (error) {
      console.error(
        "Unable to open historical validation:",
        error
      );

      setHistoryError(
        "Unable to open this validation."
      );
    }
  };

  /*
  ============================================================
  ANALYZE NEW IDEA
  ============================================================
  */

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      setError(
        "Please enter your startup idea first."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
    const currentUser = auth.currentUser;

if (!currentUser) {
  throw new Error(
    "Please sign in before validating your idea."
  );
}

const token = await currentUser.getIdToken(true);

const response = await fetch(
  "/api/validate",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idea: idea.trim(),
    }),
  }
);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Unable to analyze your idea."
        );
        return;
      }

      const result = data.result || data;

      sessionStorage.setItem(
        "validationResult",
        JSON.stringify(result)
      );

      sessionStorage.setItem(
        "startupIdea",
        idea.trim()
      );

      sessionStorage.setItem(
        "validationSource",
        "new"
      );

      router.push("/results");
    } catch (err) {
      console.error(
        "Validation error:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  NUMERIC HELPERS
  ============================================================
  */

  const findNumericValue = (
    object: any,
    possibleKeys: string[]
  ): number | null => {
    if (
      object === null ||
      object === undefined
    ) {
      return null;
    }

    if (
      typeof object === "number" &&
      Number.isFinite(object)
    ) {
      return object;
    }

    if (typeof object !== "object") {
      return null;
    }

    for (const key of possibleKeys) {
      const value = object[key];

      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return value;
      }

      if (
        value &&
        typeof value === "object"
      ) {
        const nested =
          findNumericValue(
            value,
            [
              "score",
              "value",
              "rating",
              "average",
              "total",
            ]
          );

        if (nested !== null) {
          return nested;
        }
      }
    }

    return null;
  };

  const normalizeScore = (
    score: number | null
  ): number | null => {
    if (
      score === null ||
      !Number.isFinite(score)
    ) {
      return null;
    }

    if (score >= 0 && score <= 10) {
      return Math.round(score * 10);
    }

    return Math.round(
      Math.min(
        Math.max(score, 0),
        100
      )
    );
  };

  /*
  ============================================================
  HISTORY SCORE
  ============================================================
  */

  const getHistoryScore = (
    item: HistoryItem
  ): number | null => {
    const complete =
      getCompleteHistoryResult(item);

    const candidates = [
      item.score,
      item.overallScore,
      item.result?.score,
      item.result?.overallScore,
      item.validationResult?.score,
      item.validationResult?.overallScore,
      complete.score,
      complete.overallScore,
      complete.overall?.score,
      complete.summary?.score,
    ];

    for (const value of candidates) {
      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return value;
      }

      if (
        value &&
        typeof value === "object"
      ) {
        const nested =
          findNumericValue(
            value,
            [
              "score",
              "value",
              "rating",
              "average",
              "total",
            ]
          );

        if (nested !== null) {
          return nested;
        }
      }
    }

    const findOverallScore = (
      value: any,
      depth = 0
    ): number | null => {
      if (
        value === null ||
        value === undefined ||
        depth > 8
      ) {
        return null;
      }

      if (typeof value !== "object") {
        return null;
      }

      const keys = [
        "overallScore",
        "overall_score",
        "totalScore",
        "total_score",
      ];

      for (const key of keys) {
        const candidate = value[key];

        if (
          typeof candidate === "number" &&
          Number.isFinite(candidate)
        ) {
          return candidate;
        }
      }

      if (
        typeof value.score === "number" &&
        Number.isFinite(value.score)
      ) {
        return value.score;
      }

      for (
        const [key, child] of
        Object.entries(value)
      ) {
        if (
          key === "dimensions" ||
          key === "marketOpportunity" ||
          key === "customerProblem" ||
          key === "competition" ||
          key === "businessModel" ||
          key === "marketTiming" ||
          key === "risksAndOpportunities"
        ) {
          continue;
        }

        if (
          child &&
          typeof child === "object"
        ) {
          const found =
            findOverallScore(
              child,
              depth + 1
            );

          if (found !== null) {
            return found;
          }
        }
      }

      return null;
    };

    return findOverallScore(complete);
  };

  /*
  ============================================================
  VERDICT
  ============================================================
  */

  const getHistoryVerdict = (
    item: HistoryItem
  ) => {
    const verdict =
      item.verdict ||
      item.overallVerdict ||
      item.result?.verdict ||
      item.result?.overallVerdict ||
      item.validationResult?.verdict ||
      item.validationResult?.overallVerdict;

    if (typeof verdict === "string") {
      return verdict;
    }

    if (
      verdict &&
      typeof verdict === "object"
    ) {
      return (
        verdict.label ||
        verdict.explanation ||
        verdict.text ||
        "Validation complete"
      );
    }

    return "Validation complete";
  };

  /*
  ============================================================
  DATE
  ============================================================
  */

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  /*
  ============================================================
  DIMENSION SCORE
  ============================================================
  */

  const getDimensionScore = (
    item: HistoryItem,
    dimension: DimensionKey
  ): number | null => {
    const complete =
      getCompleteHistoryResult(item);

    const dimensionObjects = [
      item.dimensions,
      complete.dimensions,
      complete.result?.dimensions,
      complete.validationResult?.dimensions,
    ];

    for (
      const dimensions of dimensionObjects
    ) {
      if (!dimensions) continue;

      const score =
        findNumericValue(
          dimensions[dimension],
          [
            "score",
            "value",
            "rating",
            "average",
          ]
        );

      if (score !== null) {
        return score;
      }
    }

    return findNumericValue(
      complete[dimension],
      [
        "score",
        "value",
        "rating",
        "average",
      ]
    );
  };

  /*
  ============================================================
  ANALYTICS
  ============================================================
  */

  const analytics = useMemo(() => {
    const validScores = historyData
      .map(getHistoryScore)
      .filter(
        (score): score is number =>
          score !== null
      )
      .map(normalizeScore)
      .filter(
        (score): score is number =>
          score !== null
      );

    const totalValidations =
      historyData.length;

    const averageScore =
      validScores.length
        ? Math.round(
            validScores.reduce(
              (sum, score) =>
                sum + score,
              0
            ) / validScores.length
          )
        : 0;

    const highestScore =
      validScores.length
        ? Math.max(...validScores)
        : 0;

    const strongIdeas =
      validScores.filter(
        (score) => score >= 75
      ).length;

    const dimensionScores =
      DIMENSIONS.map((dimension) => {
        const scores = historyData
          .map((item) =>
            getDimensionScore(
              item,
              dimension.key
            )
          )
          .filter(
            (score): score is number =>
              score !== null
          )
          .map(normalizeScore)
          .filter(
            (score): score is number =>
              score !== null
          );

        const average = scores.length
          ? Math.round(
              scores.reduce(
                (sum, score) =>
                  sum + score,
                0
              ) / scores.length
            )
          : 0;

        return {
          ...dimension,
          average,
          count: scores.length,
        };
      });

    const available =
      dimensionScores
        .filter(
          (item) => item.count > 0
        )
        .sort(
          (a, b) =>
            b.average - a.average
        );

    return {
      totalValidations,
      averageScore,
      highestScore,
      strongIdeas,
      dimensionScores,
      strongest:
        available[0] || null,
      weakest:
        available[available.length - 1] ||
        null,
    };
  }, [historyData]);

  /*
  ============================================================
  SETTINGS
  ============================================================
  */

  const handleSettings = () => {
    setActiveView("settings");
  };

  const handlePasswordReset = async () => {
    if (!auth.currentUser?.email) {
      setSecurityMessage(
        "No account email is available."
      );
      return;
    }

    setPasswordResetLoading(true);
    setSecurityMessage("");

    try {
      await sendPasswordResetEmail(
        auth,
        auth.currentUser.email
      );

      setSecurityMessage(
        `Password reset instructions were sent to ${auth.currentUser.email}.`
      );
    } catch (error: any) {
      console.error(
        "Password reset error:",
        error
      );

      setSecurityMessage(
        error?.message ||
          "Unable to send password reset email."
      );
    } finally {
      setPasswordResetLoading(false);
    }
  };

  /*
  ============================================================
  LOGOUT
  ============================================================
  */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("user");

      sessionStorage.removeItem(
        "validationResult"
      );

      sessionStorage.removeItem(
        "startupIdea"
      );

      sessionStorage.removeItem(
        "validationSource"
      );

      router.replace("/auth");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      setSecurityMessage(
        "Unable to log out. Please try again."
      );
    }
  };

  /*
  ============================================================
  AUTH LOADING
  ============================================================
  */

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#E9E0D2] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-10 h-10 rounded-full border-2 border-[#C9B9A7] border-t-[#A86F45] animate-spin" />

          <p className="mt-5 text-[14px] text-[#746C63]">
            Checking your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <div className="min-h-screen flex bg-[#E9E0D2] text-[#27231F]">

      {/* SIDEBAR */}

      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 bg-[#24211E] border-r border-[#39342E] p-5 xl:p-6 flex-col relative overflow-hidden">

        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[#B98255]/10 blur-[120px] pointer-events-none" />

        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-[#D6B58F]/8 blur-[120px] pointer-events-none" />

        <div className="relative z-10">

          <div className="flex items-center gap-3">

            <div className="relative w-11 h-11 rounded-xl bg-[#312D29] flex items-center justify-center border border-[#685A4C]">

              <Sparkles
                size={19}
                className="text-[#D3A77D]"
              />

            </div>

            <div>

              <h1 className="text-lg font-bold tracking-tight text-[#F4EEE5]">
                AI Startup
              </h1>

              <p className="text-[#C99567] text-lg font-bold">
                Co-Pilot
              </p>

            </div>

          </div>

          <p className="text-[13px] text-[#AFA79D] mt-4 leading-relaxed">
            Your thinking partner for better startup decisions.
          </p>

        </div>

        <div className="relative z-10 mt-7 rounded-xl border border-[#403A34] bg-[#2B2723] p-3.5">

          <div className="flex items-center gap-2">

            <div className="relative">
              <span className="block w-2 h-2 rounded-full bg-[#829477]" />
              <span className="absolute inset-0 rounded-full bg-[#829477] animate-ping opacity-20" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.18em] text-[#9CAD92] font-semibold">
              System Online
            </span>

          </div>

        </div>

        <nav className="relative z-10 mt-8 space-y-2">

          {[
            {
              view: "dashboard" as ViewType,
              icon: LayoutDashboard,
              label: "Dashboard",
            },
            {
              view: "analytics" as ViewType,
              icon: BarChart3,
              label: "Analytics",
            },
            {
              view: "history" as ViewType,
              icon: History,
              label: "History",
            },
            {
              view: "settings" as ViewType,
              icon: Settings,
              label: "Settings",
            },
          ].map(
            ({
              view,
              icon: Icon,
              label,
            }) => (
              <button
                key={view}
                onClick={() =>
                  setActiveView(view)
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${
                  activeView === view
                    ? "bg-[#39332D] border border-[#51483E] text-[#F4EEE5] shadow-[inset_3px_0_0_#C99567]"
                    : "text-[#AAA198] hover:text-[#F4EEE5] hover:bg-[#302B27]"
                }`}
              >
                <Icon size={19} />

                <span className="text-[15px] font-medium">
                  {label}
                </span>
              </button>
            )
          )}

        </nav>

        <button
          onClick={handleLogout}
          className="relative z-10 mt-auto flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#AAA198] hover:text-[#D28E72] hover:bg-[#302A26] transition"
        >
          <LogOut size={19} />

          <span className="text-[15px]">
            Logout
          </span>
        </button>

      </aside>

      {/* MAIN */}

      <main className="flex-1 min-w-0 relative overflow-hidden bg-[#E9E0D2]">

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -top-48 -right-40 w-[650px] h-[650px] rounded-full bg-[#C99567]/10 blur-[160px]" />

          <div className="absolute -bottom-48 -left-40 w-[650px] h-[650px] rounded-full bg-[#B8A68F]/15 blur-[160px]" />

          <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full bg-white/20 blur-[180px]" />

        </div>

        <div className="relative z-10 max-w-[1450px] mx-auto px-6 lg:px-10 py-10">

          {/* =================================================
              SETTINGS
          ================================================= */}

          {activeView === "settings" ? (

            <section>

              {/* HEADER */}

              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9">

                <div>

                  <div className="flex items-center gap-2 text-[#A86F45] mb-3">
                    <Settings size={16} />

                    <span className="text-[11px] uppercase tracking-[0.24em] font-semibold">
                      Workspace Settings
                    </span>
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#29251F]">
                    Make your workspace yours.
                  </h2>

                  <p className="mt-3 text-base text-[#746C63] max-w-2xl">
                    Manage your preferences, account access, and security from one place.
                  </p>

                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#D4C8B8] bg-[#F7F2EA] w-fit shadow-sm">

                  <span className="w-2 h-2 rounded-full bg-[#7E9173]" />

                  <span className="text-[12px] text-[#746C63]">
                    Workspace Protected
                  </span>

                </div>

              </div>

              {/* SETTINGS NAVIGATION */}

              <div className="grid md:grid-cols-3 gap-3 mb-7 max-w-4xl">

                {/* PROFILE */}

                <button
                  onClick={() =>
                    setSettingsTab("profile")
                  }
                  className={`text-left rounded-2xl border p-5 transition ${
                    settingsTab === "profile"
                      ? "border-[#B98255] bg-[#F8F3EB] shadow-[0_12px_35px_rgba(74,61,47,0.08)]"
                      : "border-[#D3C6B5] bg-[#EEE5D8] hover:bg-[#F1E9DE]"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-[#E8DDCF] border border-[#D5C8B8] flex items-center justify-center">

                      <UserCircle
                        size={18}
                        className="text-[#A86F45]"
                      />

                    </div>

                    <div>

                      <p className="text-[15px] font-semibold text-[#403A33]">
                        Profile
                      </p>

                      <p className="text-[12px] text-[#746C63] mt-1">
                        View your account details
                      </p>

                    </div>

                  </div>

                </button>

                {/* PREFERENCES */}

                <button
                  onClick={() =>
                    setSettingsTab("preferences")
                  }
                  className={`text-left rounded-2xl border p-5 transition ${
                    settingsTab === "preferences"
                      ? "border-[#B98255] bg-[#F8F3EB] shadow-[0_12px_35px_rgba(74,61,47,0.08)]"
                      : "border-[#D3C6B5] bg-[#EEE5D8] hover:bg-[#F1E9DE]"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-[#E8DDCF] border border-[#D5C8B8] flex items-center justify-center">

                      <SlidersHorizontal
                        size={18}
                        className="text-[#A86F45]"
                      />

                    </div>

                    <div>

                      <p className="text-[15px] font-semibold text-[#403A33]">
                        Preferences
                      </p>

                      <p className="text-[12px] text-[#746C63] mt-1">
                        Customize your workspace
                      </p>

                    </div>

                  </div>

                </button>

                {/* SECURITY */}

                <button
                  onClick={() =>
                    setSettingsTab("security")
                  }
                  className={`text-left rounded-2xl border p-5 transition ${
                    settingsTab === "security"
                      ? "border-[#B98255] bg-[#F8F3EB] shadow-[0_12px_35px_rgba(74,61,47,0.08)]"
                      : "border-[#D3C6B5] bg-[#EEE5D8] hover:bg-[#F1E9DE]"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-[#E8DDCF] border border-[#D5C8B8] flex items-center justify-center">

                      <Shield
                        size={18}
                        className="text-[#A86F45]"
                      />

                    </div>

                    <div>

                      <p className="text-[15px] font-semibold text-[#403A33]">
                        Security
                      </p>

                      <p className="text-[12px] text-[#746C63] mt-1">
                        Account and authentication
                      </p>

                    </div>

                  </div>

                </button>

              </div>

              {/* =================================================
                  PROFILE
              ================================================= */}

              {settingsTab === "profile" ? (

                <section className="grid xl:grid-cols-2 gap-6">

                  {/* PROFILE INFORMATION */}

                  <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-7 lg:p-9 shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                          <UserCircle
                            size={20}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-[#29251F]">
                            Your Profile
                          </h3>

                          <p className="text-[13px] text-[#746C63] mt-1">
                            Your current account information.
                          </p>

                        </div>

                      </div>

                      <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E4EBDD] border border-[#CCD8C3] text-[#617357] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">

                        <span className="w-1.5 h-1.5 rounded-full bg-[#7E9173]" />

                        Logged in

                      </span>

                    </div>

                    {/* NAME */}

                    <div className="mt-8 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                          <UserCircle
                            size={17}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#968A7D]">
                            Name
                          </p>

                          <p className="mt-1 text-[15px] font-semibold text-[#403A33] truncate">
                            {user.displayName ||
                              "Name not available"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* EMAIL */}

                    <div className="mt-3 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                          <Mail
                            size={17}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#968A7D]">
                            Email address
                          </p>

                          <p className="mt-1 text-[14px] font-semibold text-[#403A33] truncate">
                            {user.email ||
                              "Email unavailable"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* LOGIN STATUS */}

                    <div className="mt-3 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                            <Check
                              size={17}
                              className="text-[#617357]"
                            />

                          </div>

                          <div>

                            <p className="text-[14px] font-semibold text-[#403A33]">
                              Login status
                            </p>

                            <p className="mt-1 text-[12px] text-[#746C63]">
                              Your Firebase account is currently authenticated.
                            </p>

                          </div>

                        </div>

                        <span className="text-[11px] font-semibold text-[#617357]">
                          Logged in
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* ACCOUNT DETAILS */}

                  <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-7 lg:p-9 shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                        <ShieldCheck
                          size={19}
                          className="text-[#A86F45]"
                        />

                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-[#29251F]">
                          Account Details
                        </h3>

                        <p className="text-[13px] text-[#746C63] mt-1">
                          Your authenticated Firebase account.
                        </p>

                      </div>

                    </div>

                    {/* AUTHENTICATION */}

                    <div className="mt-8 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                            <ShieldCheck
                              size={17}
                              className="text-[#A86F45]"
                            />

                          </div>

                          <div>

                            <p className="text-[14px] font-semibold text-[#403A33]">
                              Firebase Authentication
                            </p>

                            <p className="mt-1 text-[12px] text-[#746C63]">
                              Your account is authenticated securely.
                            </p>

                          </div>

                        </div>

                        <span className="text-[11px] font-semibold text-[#617357]">
                          Active
                        </span>

                      </div>

                    </div>

                    {/* UID */}

                    <div className="mt-3 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#968A7D]">
                        Account ID
                      </p>

                      <p className="mt-2 text-[12px] font-mono text-[#746C63] break-all">
                        {user.uid}
                      </p>

                      <p className="mt-3 text-[11px] text-[#968A7D] leading-5">
                        This unique Firebase UID identifies your account and keeps your startup data separated from other users.
                      </p>

                    </div>

                    {/* EMAIL */}

                    <div className="mt-3 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                          <Mail
                            size={16}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div>

                          <p className="text-[13px] font-semibold text-[#403A33]">
                            Account email
                          </p>

                          <p className="mt-1 text-[11px] text-[#746C63]">
                            {user.email ||
                              "No email available"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </section>

              ) : settingsTab === "preferences" ? (

                /* =================================================
                   PREFERENCES
                ================================================= */

                <section className="grid xl:grid-cols-2 gap-6">

                  {/* APPEARANCE */}

                  <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-7 lg:p-9 shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                          <Monitor
                            size={19}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-[#29251F]">
                            Appearance
                          </h3>

                          <p className="text-[13px] text-[#746C63] mt-1">
                            Choose how your workspace feels.
                          </p>

                        </div>

                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-[#968A7D]">
                        Interface
                      </span>

                    </div>

                    <div className="mt-8 space-y-3">

                      <button
                        onClick={() =>
                          setAppearance("light")
                        }
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition ${
                          appearance === "light"
                            ? "border-[#B98255] bg-[#EEE5D8]"
                            : "border-[#D5C8B8] bg-[#F5EEE5] hover:bg-[#EEE5D8]"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                            <span className="w-4 h-4 rounded-full bg-[#C99567]" />

                          </div>

                          <div>

                            <p className="text-[14px] font-semibold text-[#403A33]">
                              Light
                            </p>

                            <p className="text-[12px] text-[#746C63]">
                              Warm premium workspace
                            </p>

                          </div>

                        </div>

                        {appearance === "light" && (
                          <div className="w-6 h-6 rounded-full bg-[#A86F45] flex items-center justify-center">
                            <Check
                              size={14}
                              className="text-white"
                            />
                          </div>
                        )}

                      </button>

                      <button
                        onClick={() =>
                          setAppearance("system")
                        }
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition ${
                          appearance === "system"
                            ? "border-[#B98255] bg-[#EEE5D8]"
                            : "border-[#D5C8B8] bg-[#F5EEE5] hover:bg-[#EEE5D8]"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                            <Monitor
                              size={16}
                              className="text-[#A86F45]"
                            />

                          </div>

                          <div>

                            <p className="text-[14px] font-semibold text-[#403A33]">
                              System
                            </p>

                            <p className="text-[12px] text-[#746C63]">
                              Follow your device preference
                            </p>

                          </div>

                        </div>

                        {appearance === "system" && (
                          <div className="w-6 h-6 rounded-full bg-[#A86F45] flex items-center justify-center">
                            <Check
                              size={14}
                              className="text-white"
                            />
                          </div>
                        )}

                      </button>

                    </div>

                  </div>

                  {/* WORKSPACE */}

                  <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-7 lg:p-9 shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                          <SlidersHorizontal
                            size={19}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-[#29251F]">
                            Workspace
                          </h3>

                          <p className="text-[13px] text-[#746C63] mt-1">
                            Control your default experience.
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="mt-8">

                      <p className="text-[13px] font-semibold text-[#403A33]">
                        Default dashboard view
                      </p>

                      <p className="mt-1 text-[12px] text-[#746C63]">
                        Choose where you want to start.
                      </p>

                      <div className="mt-3 grid grid-cols-3 gap-2">

                        {[
                          {
                            value: "dashboard",
                            label: "Dashboard",
                          },
                          {
                            value: "analytics",
                            label: "Analytics",
                          },
                          {
                            value: "history",
                            label: "History",
                          },
                        ].map((item) => (
                          <button
                            key={item.value}
                            onClick={() =>
                              setDefaultView(
                                item.value as
                                  | "dashboard"
                                  | "analytics"
                                  | "history"
                              )
                            }
                            className={`rounded-xl border px-3 py-3 text-[12px] font-semibold transition ${
                              defaultView ===
                              item.value
                                ? "border-[#B98255] bg-[#EEE5D8] text-[#403A33]"
                                : "border-[#D5C8B8] bg-[#F5EEE5] text-[#746C63] hover:bg-[#EEE5D8]"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}

                      </div>

                    </div>

                    <div className="mt-7">

                      <p className="text-[13px] font-semibold text-[#403A33]">
                        Validation experience
                      </p>

                      <p className="mt-1 text-[12px] text-[#746C63]">
                        Choose how much detail you prefer.
                      </p>

                      <div className="mt-3 space-y-2">

                        <button
                          onClick={() =>
                            setValidationExperience(
                              "detailed"
                            )
                          }
                          className={`w-full text-left rounded-xl border p-3.5 transition ${
                            validationExperience ===
                            "detailed"
                              ? "border-[#B98255] bg-[#EEE5D8]"
                              : "border-[#D5C8B8] bg-[#F5EEE5]"
                          }`}
                        >
                          <p className="text-[13px] font-semibold text-[#403A33]">
                            Detailed
                          </p>

                          <p className="text-[11px] text-[#746C63] mt-1">
                            Show deeper explanations and insights.
                          </p>
                        </button>

                        <button
                          onClick={() =>
                            setValidationExperience(
                              "balanced"
                            )
                          }
                          className={`w-full text-left rounded-xl border p-3.5 transition ${
                            validationExperience ===
                            "balanced"
                              ? "border-[#B98255] bg-[#EEE5D8]"
                              : "border-[#D5C8B8] bg-[#F5EEE5]"
                          }`}
                        >
                          <p className="text-[13px] font-semibold text-[#403A33]">
                            Balanced
                          </p>

                          <p className="text-[11px] text-[#746C63] mt-1">
                            Keep results concise and decision-focused.
                          </p>
                        </button>

                      </div>

                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-[#D7CBBB]">

                      <div>

                        {preferencesSaved ? (
                          <div className="flex items-center gap-2 text-[#6F8065]">

                            <Check size={15} />

                            <span className="text-[12px] font-semibold">
                              Preferences saved
                            </span>

                          </div>
                        ) : (
                          <p className="text-[11px] text-[#968A7D]">
                            Changes are stored for your workspace.
                          </p>
                        )}

                      </div>

                      <button
                        onClick={
                          handleSavePreferences
                        }
                        className="px-5 py-3 rounded-xl bg-[#2B2723] hover:bg-[#39332D] text-[#F8F3EB] text-[13px] font-semibold flex items-center gap-2 transition"
                      >

                        <Save size={15} />

                        Save Preferences

                      </button>

                    </div>

                  </div>

                </section>

              ) : (

                /* =================================================
                   SECURITY
                ================================================= */

                <section className="grid xl:grid-cols-2 gap-6">

                  {/* ACCOUNT */}

                  <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-7 lg:p-9 shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                          <LockKeyhole
                            size={19}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-[#29251F]">
                            Account Security
                          </h3>

                          <p className="text-[13px] text-[#746C63] mt-1">
                            Your authentication and account access.
                          </p>

                        </div>

                      </div>

                      <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E4EBDD] border border-[#CCD8C3] text-[#617357] text-[10px] font-semibold uppercase tracking-wider">

                        <Check size={11} />

                        Secure

                      </span>

                    </div>

                    {/* EMAIL */}

                    <div className="mt-8 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                          <Mail
                            size={17}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#968A7D]">
                            Account email
                          </p>

                          <p className="mt-1 text-[14px] font-semibold text-[#403A33] truncate">
                            {user.email ||
                              "Email unavailable"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* AUTH */}

                    <div className="mt-3 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                            <ShieldCheck
                              size={17}
                              className="text-[#A86F45]"
                            />

                          </div>

                          <div>

                            <p className="text-[14px] font-semibold text-[#403A33]">
                              Firebase Authentication
                            </p>

                            <p className="mt-1 text-[12px] text-[#746C63]">
                              Your dashboard access is protected.
                            </p>

                          </div>

                        </div>

                        <span className="text-[11px] font-semibold text-[#617357]">
                          Active
                        </span>

                      </div>

                    </div>

                    {/* UID */}

                    <div className="mt-3 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#968A7D]">
                        Account ID
                      </p>

                      <p className="mt-2 text-[12px] font-mono text-[#746C63] break-all">
                        {user.uid}
                      </p>

                    </div>

                  </div>

                  {/* PASSWORD + SESSION */}

                  <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-7 lg:p-9 shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                        <KeyRound
                          size={19}
                          className="text-[#A86F45]"
                        />

                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-[#29251F]">
                          Password & Access
                        </h3>

                        <p className="text-[13px] text-[#746C63] mt-1">
                          Manage how you access your workspace.
                        </p>

                      </div>

                    </div>

                    {/* PASSWORD */}

                    <div className="mt-8 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-start gap-3">

                        <div className="w-9 h-9 rounded-lg bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center shrink-0">

                          <KeyRound
                            size={16}
                            className="text-[#A86F45]"
                          />

                        </div>

                        <div className="flex-1">

                          <p className="text-[14px] font-semibold text-[#403A33]">
                            Password
                          </p>

                          <p className="mt-1 text-[12px] text-[#746C63] leading-5">
                            Send a secure password reset link to your account email.
                          </p>

                          <button
                            onClick={
                              handlePasswordReset
                            }
                            disabled={
                              passwordResetLoading
                            }
                            className="mt-4 px-4 py-2.5 rounded-xl border border-[#C8B6A1] bg-[#F8F3EB] hover:bg-[#E5DACB] disabled:opacity-50 text-[#403A33] text-[12px] font-semibold flex items-center gap-2 transition"
                          >

                            {passwordResetLoading ? (
                              <>
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#C9B9A7] border-t-[#A86F45] animate-spin" />

                                Sending...
                              </>
                            ) : (
                              <>
                                Send Reset Email

                                <ArrowRight
                                  size={14}
                                />
                              </>
                            )}

                          </button>

                        </div>

                      </div>

                    </div>

                    {/* SECURITY MESSAGE */}

                    {securityMessage && (
                      <div className="mt-4 rounded-2xl border border-[#C9D5C1] bg-[#EAF0E5] p-4">

                        <div className="flex items-start gap-2.5">

                          <Check
                            size={17}
                            className="text-[#617357] mt-0.5"
                          />

                          <p className="text-[12px] text-[#617357] leading-5">
                            {securityMessage}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* CURRENT SESSION */}

                    <div className="mt-4 rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-5">

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                            <Activity
                              size={16}
                              className="text-[#A86F45]"
                            />

                          </div>

                          <div>

                            <p className="text-[14px] font-semibold text-[#403A33]">
                              Current session
                            </p>

                            <p className="mt-1 text-[12px] text-[#746C63]">
                              This browser is currently authenticated.
                            </p>

                          </div>

                        </div>

                        <span className="text-[10px] uppercase tracking-wider text-[#617357] font-semibold">
                          Active
                        </span>

                      </div>

                    </div>

                    {/* LOGOUT */}

                    <div className="mt-7 pt-6 border-t border-[#D7CBBB]">

                      <p className="text-[11px] text-[#968A7D] leading-5">
                        Logging out will end your current authenticated session on this browser.
                      </p>

                      <button
                        onClick={handleLogout}
                        className="mt-4 w-full px-5 py-3.5 rounded-xl border border-[#D5B8AB] bg-[#F3E2DC] hover:bg-[#EED7D0] text-[#8D5143] text-[13px] font-semibold flex items-center justify-center gap-2 transition"
                      >

                        <LogOut size={16} />

                        Sign Out

                      </button>

                    </div>

                  </div>

                </section>

              )}

              <div className="mt-7 rounded-2xl border border-[#D3C6B5] bg-[#EEE5D8] px-5 py-4">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={17}
                    className="text-[#A86F45] mt-0.5"
                  />

                  <div>

                    <p className="text-[12px] font-semibold text-[#403A33]">
                      Your workspace is protected
                    </p>

                    <p className="mt-1 text-[11px] text-[#746C63] leading-5">
                      Authentication is handled through Firebase. Your validation APIs receive a Firebase ID token so your data can be associated with your authenticated account.
                    </p>

                  </div>

                </div>

              </div>

            </section>

          ) : activeView === "analytics" ? (

            /* =================================================
               ANALYTICS
            ================================================= */

            <section>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-9">

                <div>

                  <div className="flex items-center gap-2 text-[#A86F45] mb-3">

                    <BarChart3 size={16} />

                    <span className="text-[11px] uppercase tracking-[0.24em] font-semibold">
                      Validation Analytics
                    </span>

                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#29251F]">
                    Understand your validation patterns.
                  </h2>

                  <p className="mt-3 text-base text-[#746C63]">
                    See how your startup ideas are performing across your validation history.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setActiveView("dashboard")
                  }
                  className="w-fit px-5 py-3 rounded-xl bg-[#2B2723] hover:bg-[#39332D] text-[#F8F3EB] text-[13px] font-semibold flex items-center gap-2 transition"
                >
                  <ArrowRight
                    size={16}
                    className="rotate-180"
                  />
                  Back to Dashboard
                </button>

              </div>

              {historyLoading ? (

                <section className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-16 text-center">

                  <div className="mx-auto w-10 h-10 rounded-full border-2 border-[#C9B9A7] border-t-[#A86F45] animate-spin" />

                  <p className="mt-5 text-[14px] text-[#746C63]">
                    Analyzing your validation history...
                  </p>

                </section>

              ) : (

                <>

                  <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    {[
                      {
                        icon: Activity,
                        label: "Ideas Tested",
                        value:
                          analytics.totalValidations,
                      },
                      {
                        icon: Gauge,
                        label: "Average Score",
                        value:
                          analytics.averageScore,
                      },
                      {
                        icon: Trophy,
                        label: "Strong Ideas",
                        value:
                          analytics.strongIdeas,
                      },
                      {
                        icon: TrendingUp,
                        label: "Highest Score",
                        value:
                          analytics.highestScore,
                      },
                    ].map(
                      ({
                        icon: Icon,
                        label,
                        value,
                      }) => (

                        <div
                          key={label}
                          className="rounded-2xl border border-[#D3C6B5] bg-[#F8F3EB] p-6 shadow-[0_15px_40px_rgba(74,61,47,0.07)]"
                        >

                          <div className="w-11 h-11 rounded-xl bg-[#EEE5D8] border border-[#D5C8B8] flex items-center justify-center">

                            <Icon
                              size={20}
                              className="text-[#A86F45]"
                            />

                          </div>

                          <p className="mt-6 text-4xl font-bold text-[#29251F]">
                            {value}
                          </p>

                          <p className="mt-2 text-[13px] text-[#746C63]">
                            {label}
                          </p>

                        </div>

                      )
                    )}

                  </section>

                  <section className="mt-7 rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-8 lg:p-10">

                    <div className="flex items-center gap-2 text-[#A86F45]">

                      <BrainCircuit size={17} />

                      <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                        Dimension Performance
                      </span>

                    </div>

                    <h2 className="mt-4 text-3xl font-bold text-[#29251F]">
                      Where your ideas are strongest.
                    </h2>

                    <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                      {analytics.dimensionScores.map(
                        (dimension) => {

                          const Icon =
                            dimension.icon;

                          return (
                            <div
                              key={
                                dimension.key
                              }
                              className="rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-6"
                            >

                              <div className="flex items-start justify-between">

                                <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                                  <Icon
                                    size={19}
                                    className="text-[#A86F45]"
                                  />

                                </div>

                                <span className="text-2xl font-bold text-[#29251F]">
                                  {dimension.average}
                                </span>

                              </div>

                              <h3 className="mt-5 text-[16px] font-semibold text-[#403A33]">
                                {dimension.title}
                              </h3>

                              <p className="mt-2 text-[13px] text-[#746C63] leading-6">
                                {dimension.description}
                              </p>

                              <div className="mt-5 h-2 rounded-full bg-[#D9CDBE] overflow-hidden">

                                <div
                                  className="h-full rounded-full bg-[#B98255]"
                                  style={{
                                    width: `${Math.min(
                                      Math.max(
                                        dimension.average,
                                        0
                                      ),
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                              <p className="mt-2 text-[11px] text-[#968A7D]">
                                {dimension.count}{" "}
                                validations analyzed
                              </p>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </section>

                  <section className="mt-7 grid lg:grid-cols-2 gap-5">

                    <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-8">

                      <div className="flex items-center gap-2 text-[#A86F45]">

                        <Trophy size={17} />

                        <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                          Strongest Area
                        </span>

                      </div>

                      <h2 className="mt-5 text-2xl font-bold text-[#29251F]">
                        {analytics.strongest?.title ||
                          "Not enough data"}
                      </h2>

                      <p className="mt-3 text-[14px] text-[#746C63] leading-7">
                        {analytics.strongest
                          ? `Your strongest average dimension is ${analytics.strongest.title} with a score of ${analytics.strongest.average}.`
                          : "Analyze more startup ideas to discover your strongest validation area."}
                      </p>

                    </div>

                    <div className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-8">

                      <div className="flex items-center gap-2 text-[#A86F45]">

                        <CircleAlert size={17} />

                        <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                          Needs Attention
                        </span>

                      </div>

                      <h2 className="mt-5 text-2xl font-bold text-[#29251F]">
                        {analytics.weakest?.title ||
                          "Not enough data"}
                      </h2>

                      <p className="mt-3 text-[14px] text-[#746C63] leading-7">
                        {analytics.weakest
                          ? `Your lowest average dimension is ${analytics.weakest.title} with a score of ${analytics.weakest.average}.`
                          : "Analyze more startup ideas to identify areas that need more validation."}
                      </p>

                    </div>

                  </section>

                </>

              )}

            </section>

          ) : activeView === "history" ? (

            /* =================================================
               HISTORY
            ================================================= */

            <section>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-9">

                <div>

                  <div className="flex items-center gap-2 text-[#A86F45] mb-3">

                    <History size={16} />

                    <span className="text-[11px] uppercase tracking-[0.24em] font-semibold">
                      Validation History
                    </span>

                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#29251F]">
                    Your startup history.
                  </h2>

                  <p className="mt-3 text-base text-[#746C63]">
                    Review the startup ideas you have analyzed.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setActiveView("dashboard")
                  }
                  className="w-fit px-5 py-3 rounded-xl bg-[#2B2723] hover:bg-[#39332D] text-[#F8F3EB] text-[13px] font-semibold flex items-center gap-2 transition"
                >

                  <ArrowRight
                    size={16}
                    className="rotate-180"
                  />

                  Back to Dashboard

                </button>

              </div>

              <section className="rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] p-8 lg:p-10 shadow-[0_25px_70px_rgba(74,61,47,0.10)]">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h3 className="text-2xl font-bold text-[#29251F]">
                      Recent Validations
                    </h3>

                    <p className="mt-2 text-[14px] text-[#746C63]">
                      Your previously analyzed startup ideas.
                    </p>

                  </div>

                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-[#D4C8B8] bg-[#EEE5D8]">

                    <span className="w-2 h-2 rounded-full bg-[#7E9173]" />

                    <span className="text-[11px] text-[#746C63]">
                      {historyData.length}{" "}
                      {historyData.length === 1
                        ? "Validation"
                        : "Validations"}
                    </span>

                  </div>

                </div>

                {historyLoading ? (

                  <div className="rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] px-6 py-16 text-center">

                    <div className="mx-auto w-10 h-10 rounded-full border-2 border-[#C9B9A7] border-t-[#A86F45] animate-spin" />

                    <p className="mt-5 text-[14px] text-[#746C63]">
                      Loading your validation history...
                    </p>

                  </div>

                ) : historyData.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-[#CFC1B0] bg-[#EEE5D8] px-6 py-16 text-center">

                    <div className="mx-auto w-14 h-14 rounded-2xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                      <History
                        size={25}
                        className="text-[#A86F45]"
                      />

                    </div>

                    <h4 className="mt-6 text-xl font-bold text-[#403A33]">
                      No validations yet
                    </h4>

                    <p className="mt-2 max-w-md mx-auto text-[14px] text-[#746C63] leading-6">
                      Once you analyze a startup idea, your validation results will be saved here.
                    </p>

                    <button
                      onClick={() =>
                        setActiveView("dashboard")
                      }
                      className="mt-7 px-6 py-3 rounded-xl bg-[#2B2723] text-[#F8F3EB] font-semibold text-[13px] inline-flex items-center gap-2"
                    >

                      Test a New Idea

                      <ArrowRight size={16} />

                    </button>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {historyData.map(
                      (item, index) => {

                        const score =
                          normalizeScore(
                            getHistoryScore(item)
                          );

                        return (

                          <button
                            key={
                              item.id || index
                            }
                            onClick={() =>
                              handleOpenHistory(
                                item
                              )
                            }
                            className="w-full text-left group rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] hover:bg-[#F1E9DE] hover:border-[#C8B6A1] p-5 lg:p-6 transition"
                          >

                            <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                              <div className="w-12 h-12 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center shrink-0">

                                <BrainCircuit
                                  size={21}
                                  className="text-[#A86F45]"
                                />

                              </div>

                              <div className="flex-1 min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#A86F45]">
                                    Validation
                                  </span>

                                  <span className="text-[#B6AA9C]">
                                    •
                                  </span>

                                  <span className="text-[11px] text-[#968A7D]">
                                    {formatDate(
                                      item.createdAt
                                    )}
                                  </span>

                                </div>

                                <h4 className="mt-2 text-[17px] lg:text-[18px] font-bold text-[#403A33]">
                                  {getHistoryIdea(
                                    item
                                  )}
                                </h4>

                                <p className="mt-2 text-[13px] text-[#746C63]">
                                  {getHistoryVerdict(
                                    item
                                  )}
                                </p>

                              </div>

                              {score !== null && (

                                <div className="text-center min-w-[70px]">

                                  <p className="text-[10px] uppercase tracking-wider text-[#968A7D]">
                                    Score
                                  </p>

                                  <p className="mt-1 text-2xl font-bold text-[#29251F]">
                                    {score}
                                  </p>

                                </div>

                              )}

                              <ArrowRight
                                size={17}
                                className="text-[#A86F45] group-hover:translate-x-1 transition"
                              />

                            </div>

                          </button>

                        );
                      }
                    )}

                  </div>

                )}

              </section>

            </section>

          ) : (

            /* =================================================
               DASHBOARD
            ================================================= */

            <>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-9">

                <div>

                  <div className="flex items-center gap-2 text-[#A86F45] mb-3">

                    <BrainCircuit size={16} />

                    <span className="text-[11px] uppercase tracking-[0.24em] font-semibold">
                      Your Startup Workspace
                    </span>

                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#29251F]">
                    Welcome back, Founder.
                  </h2>

                  <p className="mt-3 text-base text-[#746C63]">
                    Turn your startup idea into a decision you can act on.
                  </p>

                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#D4C8B8] bg-[#F7F2EA] w-fit shadow-sm">

                  <span className="w-2 h-2 rounded-full bg-[#7E9173]" />

                  <span className="text-[12px] text-[#746C63]">
                    Workspace Ready
                  </span>

                </div>

              </div>

              <section className="relative rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] overflow-hidden shadow-[0_25px_70px_rgba(74,61,47,0.10)]">

                <div className="relative grid lg:grid-cols-[0.72fr_1.6fr]">

                  <div className="order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-[#D7CBBB] bg-[#F0E8DC] p-8 lg:p-10">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-[#E3D8C9] border border-[#D1C2AF] flex items-center justify-center">

                        <Activity
                          size={17}
                          className="text-[#A86F45]"
                        />

                      </div>

                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86F45] font-semibold">
                        What we'll analyze
                      </p>

                    </div>

                    <h3 className="mt-6 text-2xl lg:text-[28px] font-bold text-[#29251F]">
                      What will you discover?
                    </h3>

                    <p className="mt-4 text-[14px] text-[#746C63] leading-7">
                      We'll examine your startup idea across the areas that matter before you build.
                    </p>

                    <div className="mt-8 space-y-3">

                      {[
                        {
                          icon: TrendingUp,
                          title: "Market Opportunity",
                          text: "Is there a real opportunity worth pursuing?",
                        },
                        {
                          icon: Users,
                          title: "Customer Problem",
                          text: "Does the problem matter enough to solve?",
                        },
                        {
                          icon: Target,
                          title: "Competition",
                          text: "What alternatives are customers using today?",
                        },
                        {
                          icon: ShieldCheck,
                          title: "Risks & Opportunities",
                          text: "What could strengthen or weaken the idea?",
                        },
                      ].map(
                        ({
                          icon: Icon,
                          title,
                          text,
                        }) => (

                          <div
                            key={title}
                            className="flex gap-4 rounded-xl p-3 -mx-3 hover:bg-[#E7DED1] transition"
                          >

                            <div className="w-10 h-10 rounded-xl bg-[#E4D9CA] border border-[#D2C3B1] flex items-center justify-center shrink-0">

                              <Icon
                                size={18}
                                className="text-[#A86F45]"
                              />

                            </div>

                            <div>

                              <p className="text-[14px] font-semibold text-[#403A33]">
                                {title}
                              </p>

                              <p className="mt-1 text-[13px] text-[#756E64] leading-5">
                                {text}
                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                    <div className="mt-8 pt-6 border-t border-[#D5C8B8]">

                      <div className="flex items-center justify-between">

                        <span className="text-[11px] uppercase tracking-wider text-[#968A7D]">
                          Analysis areas
                        </span>

                        <span className="text-[11px] text-[#A86F45] font-semibold">
                          06 READY
                        </span>

                      </div>

                      <div className="mt-3 flex gap-1">

                        {Array.from({
                          length: 6,
                        }).map((_, i) => (
                          <span
                            key={i}
                            className="h-1.5 flex-1 rounded-full bg-[#B98255]/60"
                          />
                        ))}

                      </div>

                    </div>

                  </div>

                  <div className="order-1 lg:order-2 p-8 lg:p-11 xl:p-14">

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-2.5 text-[#A86F45]">

                        <Lightbulb size={19} />

                        <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                          Start with your idea
                        </span>

                      </div>

                      <div className="hidden sm:flex items-center gap-2.5 text-[11px] uppercase tracking-wider text-[#968A7D]">

                        <Zap size={13} />

                        Smart Analysis

                      </div>

                    </div>

                    <h1 className="mt-7 text-4xl lg:text-5xl xl:text-[56px] leading-[1.08] font-bold tracking-tight max-w-3xl text-[#29251F]">
                      What are you building?
                    </h1>

                    <p className="mt-5 text-[15px] text-[#746C63] leading-7 max-w-2xl">
                      Tell us about your startup idea. We'll help you understand the opportunity, challenge your assumptions, and identify what to validate next.
                    </p>

                    <div className="mt-9">

                      <div className="flex items-center justify-between mb-3">

                        <label className="text-[14px] font-semibold text-[#403A33]">
                          Your startup idea
                        </label>

                        <span className="text-[11px] uppercase tracking-wider text-[#968A7D]">
                          Input
                        </span>

                      </div>

                      <textarea
                        value={idea}
                        onChange={(e) => {
                          setIdea(
                            e.target.value
                          );
                          setError("");
                        }}
                        placeholder="Describe the problem you're solving, who it's for, and what you're building..."
                        className="w-full min-h-[240px] resize-none rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] px-6 py-6 text-[15px] leading-7 text-[#29251F] placeholder:text-[#9A8F84] outline-none focus:border-[#B98255]/70 focus:bg-[#F8F3EB] transition"
                      />

                    </div>

                    {error && (
                      <p className="mt-4 text-[14px] text-[#A45F4C]">
                        {error}
                      </p>
                    )}

                    <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                      <div>

                        <p className="text-[13px] text-[#746C63]">
                          Start with the problem, product, or customer.
                        </p>

                        <p className="text-[12px] text-[#968A7D] mt-1.5">
                          Clarity before commitment.
                        </p>

                      </div>

                      <button
                        onClick={handleAnalyze}
                        disabled={
                          loading ||
                          !idea.trim()
                        }
                        className="min-h-[52px] px-8 rounded-xl bg-[#2B2723] hover:bg-[#39332D] disabled:opacity-30 disabled:cursor-not-allowed text-[#F8F3EB] font-bold text-[14px] flex items-center justify-center gap-2.5 transition shadow-[0_12px_28px_rgba(43,39,35,0.16)]"
                      >

                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#F8F3EB]/30 border-t-[#F8F3EB] rounded-full animate-spin" />

                            Analyzing...
                          </>
                        ) : (
                          <>
                            Test My Idea

                            <ArrowRight
                              size={17}
                            />
                          </>
                        )}

                      </button>

                    </div>

                    <div className="mt-9 pt-7 border-t border-[#D7CBBB]">

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        <span className="text-[#A86F45] text-[15px] font-semibold">
                          Turn an idea into a decision.
                        </span>

                        <span className="hidden sm:block w-8 h-px bg-[#D7CBBB]" />

                        <span className="text-[12px] text-[#746C63]">
                          Challenge assumptions before building.
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* VALIDATION JOURNEY */}

              <section className="mt-9 relative rounded-3xl border border-[#D3C6B5] bg-[#F8F3EB] overflow-hidden shadow-[0_20px_60px_rgba(74,61,47,0.08)]">

                <div className="relative p-8 lg:p-10">

                  <div>

                    <div className="flex items-center gap-2.5 text-[#A86F45]">

                      <BrainCircuit size={17} />

                      <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                        Validation Journey
                      </span>

                    </div>

                    <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-[#29251F]">
                      From idea to informed decision.
                    </h2>

                    <p className="mt-3 text-[15px] text-[#746C63] max-w-2xl leading-7">
                      Move through a simple validation process before committing your time, money, and energy to building.
                    </p>

                  </div>

                  <div className="mt-9 grid md:grid-cols-4 gap-4">

                    {[
                      {
                        number: "01",
                        title: "Idea",
                        text: "Start with the problem, customer, or product you want to build.",
                        icon: Lightbulb,
                      },
                      {
                        number: "02",
                        title: "Validate",
                        text: "Challenge your assumptions across the areas that matter.",
                        icon: BrainCircuit,
                      },
                      {
                        number: "03",
                        title: "Results",
                        text: "Understand the strengths, weaknesses, risks, and opportunities.",
                        icon: BarChart3,
                      },
                      {
                        number: "04",
                        title: "Action",
                        text: "Know what to test next before making your next big move.",
                        icon: ArrowRight,
                      },
                    ].map(
                      ({
                        number,
                        title,
                        text,
                        icon: Icon,
                      }) => (

                        <div
                          key={number}
                          className="relative rounded-2xl border border-[#D5C8B8] bg-[#EEE5D8] p-6 hover:bg-[#F1E9DE] transition"
                        >

                          <div className="flex items-center justify-between">

                            <div className="w-10 h-10 rounded-xl bg-[#F8F3EB] border border-[#D5C8B8] flex items-center justify-center">

                              <Icon
                                size={19}
                                className="text-[#A86F45]"
                              />

                            </div>

                            <span className="text-[10px] font-mono text-[#968A7D]">
                              {number}
                            </span>

                          </div>

                          <h3 className="mt-6 text-[17px] font-semibold text-[#403A33]">
                            {title}
                          </h3>

                          <p className="mt-2.5 text-[13px] text-[#746C63] leading-6">
                            {text}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                  <div className="mt-8 pt-7 border-t border-[#D7CBBB]">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                      <span className="text-[#A86F45] text-[15px] font-semibold">
                        Don't build on assumptions.
                      </span>

                      <span className="hidden sm:block w-8 h-px bg-[#D7CBBB]" />

                      <span className="text-[12px] text-[#746C63]">
                        Validate first. Decide with confidence.
                      </span>

                    </div>

                  </div>

                </div>

              </section>

              <div className="py-9 text-center">

                <p className="text-[13px] text-[#968A7D]">
                  AI Startup Co-Pilot • Validate before you build.
                </p>

              </div>

            </>

          )}

        </div>

      </main>

    </div>
  );
}