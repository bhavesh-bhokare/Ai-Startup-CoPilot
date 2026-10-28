import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Firebase Admin environment variables are not configured."
  );
}

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

export const adminAuth = getAuth(adminApp);

export const adminDb = getFirestore(adminApp);

/*
=========================================================
VERIFY FIREBASE ID TOKEN
=========================================================

This function MUST be used by protected server APIs.

The UID comes from Firebase after the token is verified.
We NEVER trust a UID sent by the browser.
=========================================================
*/

export async function verifyIdToken(
  authorizationHeader: string | null
) {
  if (!authorizationHeader) {
    throw new Error("Missing authorization header.");
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Invalid authorization format.");
  }

  const idToken = authorizationHeader.substring(7).trim();

  if (!idToken) {
    throw new Error("Missing Firebase ID token.");
  }

  try {
    const decodedToken =
      await adminAuth.verifyIdToken(idToken);

    return decodedToken;
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    throw new Error("Invalid or expired authentication token.");
  }
}