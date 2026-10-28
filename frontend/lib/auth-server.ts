import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function getAuthenticatedUser(
  request: NextRequest
) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.substring(7).trim();

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token, true);

    // Server-side email verification check
    if (decodedToken.email_verified !== true) {
      return null;
    }

    return decodedToken;
  } catch (error) {
    console.error("Firebase authentication failed:", error);
    return null;
  }
}