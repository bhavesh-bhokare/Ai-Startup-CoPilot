
import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { analyticsRateLimit } from "@/lib/rate-limit";
/* ============================================================
   TYPES
============================================================ */

type DimensionKey =
  | "marketOpportunity"
  | "customerProblem"
  | "competition"
  | "businessModel"
  | "marketTiming"
  | "risksAndOpportunities";

type DimensionConfig = {
  key: DimensionKey;
  title: string;
  description: string;
};

/* ============================================================
   ANALYTICS CONFIGURATION
============================================================ */

const DIMENSIONS: DimensionConfig[] = [
  {
    key: "marketOpportunity",
    title: "Market Opportunity",
    description:
      "How attractive and promising the potential market appears.",
  },
  {
    key: "customerProblem",
    title: "Customer Problem",
    description:
      "How meaningful and urgent the customer problem appears.",
  },
  {
    key: "competition",
    title: "Competition",
    description:
      "How well the idea can compete with existing alternatives.",
  },
  {
    key: "businessModel",
    title: "Business Model",
    description:
      "How clearly the idea can create and capture economic value.",
  },
  {
    key: "marketTiming",
    title: "Market Timing",
    description:
      "How favorable the current timing appears for the idea.",
  },
  {
    key: "risksAndOpportunities",
    title: "Risks & Opportunities",
    description:
      "The balance between important risks and potential opportunities.",
  },
];

/* ============================================================
   HELPERS
============================================================ */

function toScore(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  /*
    Your validation API uses a 0-10 scale.

    This defensive conversion also handles older records
    that may have accidentally stored a 0-100 score.
  */

  const normalized =
    value > 10 ? value / 10 : value;

  return Math.max(
    0,
    Math.min(
      10,
      normalized
    )
  );
}

function average(
  values: number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  );

  return Number(
    (total / values.length).toFixed(1)
  );
}

function scoreTo100(
  score: number
): number {
  return Math.round(score * 10);
}

function cleanString(
  value: unknown
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

/* ============================================================
   GET /api/analytics
============================================================ */

export async function GET(
  request: NextRequest
) {
  try {
    /* ========================================================
       1. AUTHENTICATION
       
       SECURITY:
       - Firebase ID token is required.
       - Token is verified server-side.
       - Revoked tokens are rejected.
       - Email verification is checked.
       - UID comes ONLY from the verified token.
    ======================================================== */

    const user =
      await getAuthenticatedUser(
        request
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Authentication required.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "private, no-store, max-age=0",
          },
        }
      );
    }

    const uid = user.uid;
    /* ========================================================
   2. RATE LIMIT
======================================================== */

try {
  const { success, reset } =
    await analyticsRateLimit.limit(uid);

  if (!success) {
    const retryAfter = Math.max(
      1,
      Math.ceil(
        (reset - Date.now()) / 1000
      )
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Too many analytics requests. Please wait before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After":
            String(retryAfter),

          "Cache-Control":
            "private, no-store, max-age=0",
        },
      }
    );
  }
} catch (error) {
  console.error(
    "Analytics rate limit error:",
    error
  );

  return NextResponse.json(
    {
      success: false,
      error:
        "Analytics service is temporarily unavailable. Please try again later.",
    },
    {
      status: 503,
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    }
  );
}

    /* ========================================================
       2. DEFENSIVE UID VALIDATION
    ======================================================== */

    if (
      typeof uid !== "string" ||
      uid.trim().length === 0
    ) {
      console.error(
        "Analytics API: authenticated token has no valid UID."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to identify the authenticated user.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "private, no-store, max-age=0",
          },
        }
      );
    }

    /* ========================================================
       3. LOAD CURRENT USER'S VALIDATIONS ONLY
       
       SECURITY:
       The UID is obtained exclusively from Firebase.

       We intentionally DO NOT read:
       - ?uid=
       - request body UID
       - custom UID headers
       - localStorage UID
    ======================================================== */

    const snapshot =
      await adminDb
        .collection(
          "validationResults"
        )
        .where("uid", "==", uid)
        .orderBy(
          "createdAt",
          "desc"
        )
        .limit(100)
        .get();

    /* ========================================================
       4. EMPTY HISTORY
    ======================================================== */

    if (snapshot.empty) {
      const emptyDimensionScores =
        DIMENSIONS.map(
          (dimension) => ({
            key: dimension.key,
            title: dimension.title,
            description:
              dimension.description,
            average: 0,
            count: 0,
          })
        );

      return NextResponse.json(
        {
          success: true,

          analytics: {
            totalValidations: 0,

            averageScore: 0,

            strongIdeas: 0,

            highestScore: 0,

            dimensionScores:
              emptyDimensionScores,

            strongest: null,

            weakest: null,
          },
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "private, no-store, max-age=0",
          },
        }
      );
    }

    /* ========================================================
       5. CALCULATE OVERALL ANALYTICS
    ======================================================== */

    const overallScores: number[] = [];

    let strongIdeas = 0;

    let highestScore = 0;

    /* ========================================================
       6. CALCULATE DIMENSION ANALYTICS
    ======================================================== */

    const dimensionValues =
      new Map<
        DimensionKey,
        number[]
      >();

    for (const dimension of DIMENSIONS) {
      dimensionValues.set(
        dimension.key,
        []
      );
    }

    /* ========================================================
       7. PROCESS USER'S RECORDS
    ======================================================== */

    for (const doc of snapshot.docs) {
      const data = doc.data();

      /* ------------------------------------------------------
         Overall score
      ------------------------------------------------------ */

      const overallScore =
        toScore(
          data?.overallAssessment
            ?.score
        );

      if (
        overallScore !== null
      ) {
        overallScores.push(
          overallScore
        );

        if (
          overallScore >= 7
        ) {
          strongIdeas += 1;
        }

        if (
          overallScore >
          highestScore
        ) {
          highestScore =
            overallScore;
        }
      }

      /* ------------------------------------------------------
         Dimension scores
      ------------------------------------------------------ */

      for (const dimension of DIMENSIONS) {
        const score =
          toScore(
            data?.dimensions?.[
              dimension.key
            ]?.score
          );

        if (
          score !== null
        ) {
          dimensionValues
            .get(
              dimension.key
            )
            ?.push(score);
        }
      }
    }

    /* ========================================================
       8. OVERALL SCORE
    ======================================================== */

    const averageOverallScore =
      average(
        overallScores
      );

    /* ========================================================
       9. DIMENSION PERFORMANCE
    ======================================================== */

    const dimensionScores =
      DIMENSIONS.map(
        (dimension) => {
          const values =
            dimensionValues.get(
              dimension.key
            ) || [];

          return {
            key: dimension.key,

            title:
              dimension.title,

            description:
              dimension.description,

            average:
              average(values),

            count:
              values.length,
          };
        }
      );

    /* ========================================================
       10. STRONGEST / WEAKEST
    ======================================================== */

    const dimensionsWithData =
      dimensionScores.filter(
        (dimension) =>
          dimension.count > 0
      );

    let strongest:
      (typeof dimensionScores)[number] |
      null =
      null;

    let weakest:
      (typeof dimensionScores)[number] |
      null =
      null;

    if (
      dimensionsWithData.length > 0
    ) {
      strongest =
        dimensionsWithData.reduce(
          (best, current) =>
            current.average >
            best.average
              ? current
              : best
        );

      weakest =
        dimensionsWithData.reduce(
          (worst, current) =>
            current.average <
            worst.average
              ? current
              : worst
        );
    }

    /* ========================================================
       11. FINAL ANALYTICS RESULT
    ======================================================== */

    const analytics = {
      /*
        Number of validation records belonging
        to the authenticated user.
      */

      totalValidations:
        snapshot.size,

      /*
        Dashboard currently displays this value
        as a 0-100 style score.

        Example:
        7.5 / 10 -> 75
      */

      averageScore:
        scoreTo100(
          averageOverallScore
        ),

      /*
        Strong idea = overall score >= 7/10.
      */

      strongIdeas,

      /*
        Highest score converted to 0-100
        for dashboard presentation.
      */

      highestScore:
        scoreTo100(
          highestScore
        ),

      /*
        Dimension averages are returned as
        0-100 values because the dashboard
        progress bars use percentages.
      */

      dimensionScores:
        dimensionScores.map(
          (dimension) => ({
            ...dimension,

            average:
              scoreTo100(
                dimension.average
              ),
          })
        ),

      /*
        Strongest and weakest are also converted
        to the same 0-100 representation.
      */

      strongest: strongest
        ? {
            ...strongest,

            average:
              scoreTo100(
                strongest.average
              ),
          }
        : null,

      weakest: weakest
        ? {
            ...weakest,

            average:
              scoreTo100(
                weakest.average
              ),
          }
        : null,
    };

    /* ========================================================
       12. RETURN PRIVATE USER-SPECIFIC RESPONSE
    ======================================================== */

    return NextResponse.json(
      {
        success: true,
        analytics,
      },
      {
        status: 200,

        headers: {
          /*
            Analytics contains private startup
            validation information.

            Prevent browser/proxy caching.
          */

          "Cache-Control":
            "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    /* ========================================================
       13. SERVER ERROR
       
       Never expose Firestore internals to the client.
    ======================================================== */

    console.error(
      "Analytics API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load validation analytics.",
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      }
    );
  }
}

