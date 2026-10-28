import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { historyRateLimit } from "@/lib/rate-limit";
/* ============================================================
   FIRESTORE SERIALIZATION
============================================================ */

function serializeFirestoreValue(
  value: unknown
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  /*
   * Firestore Timestamp
   */
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate ===
      "function"
  ) {
    try {
      return (
        value as {
          toDate: () => Date;
        }
      )
        .toDate()
        .toISOString();
    } catch {
      return null;
    }
  }

  /*
   * Arrays
   */
  if (Array.isArray(value)) {
    return value.map((item) =>
      serializeFirestoreValue(item)
    );
  }

  /*
   * Objects
   */
  if (typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, childValue] of Object.entries(
      value
    )) {
      result[key] =
        serializeFirestoreValue(childValue);
    }

    return result;
  }

  /*
   * Primitive values
   */
  return value;
}

/* ============================================================
   GET /api/history
============================================================ */

export async function GET(
  request: NextRequest
) {
  try {
    /* ========================================================
       1. AUTHENTICATION

       IMPORTANT:
       - Token is read only from Authorization header.
       - UID is obtained only from the verified Firebase token.
       - Client cannot provide or override UID.
       - getAuthenticatedUser() also checks email verification.
    ======================================================== */

    const user =
      await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          history: [],
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
  

    /* ========================================================
       2. BASIC UID SAFETY CHECK

       Firebase verified tokens should always contain a UID.
       This is an additional defensive check.
    ======================================================== */

    if (
      typeof uid !== "string" ||
      uid.trim().length === 0
    ) {
      console.error(
        "History API: authenticated token has no valid UID."
      );

      return NextResponse.json(
        {
          success: false,
          history: [],
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
       3. GET CURRENT USER'S HISTORY ONLY

       SECURITY:
       The Firestore query uses ONLY the UID obtained
       from the verified Firebase ID token.

       A user cannot request another user's history by
       sending ?uid=another-user.
    ======================================================== */

    const snapshot =
      await adminDb
        .collection("validationResults")
        .where("uid", "==", uid)
       .orderBy("createdAt", "desc")
.limit(100)
.get();

    /* ========================================================
       4. SERIALIZE FIRESTORE DATA
    ======================================================== */

    const history = snapshot.docs.map(
      (doc) => {
        const rawData = doc.data();

        return {
          id: doc.id,
          ...(
            serializeFirestoreValue(
              rawData
            ) as Record<
              string,
              unknown
            >
          ),
        };
      }
    );

    /* ========================================================
       5. RETURN SUCCESS

       no-store is important because this response contains
       private user-specific startup validation history.
    ======================================================== */

    return NextResponse.json(
      {
        success: true,
        count: history.length,
        history,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    /* ========================================================
       6. SERVER-SIDE ERROR LOGGING

       Keep detailed errors in server logs only.
       Never expose Firebase/Firestore internals to users.
    ======================================================== */

    console.error(
      "History API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        history: [],
        error:
          "Failed to load validation history.",
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