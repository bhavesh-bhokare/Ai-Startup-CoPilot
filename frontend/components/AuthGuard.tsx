"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

interface AuthGuardProps {
  children: ReactNode;
}

const protectedRoutes = [
  "/dashboard",
  "/results",
  "/validation-Roadmap",
];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

 const normalizedPathname =
  pathname.toLowerCase();

const isProtectedRoute =
  protectedRoutes.some((route) => {
    const normalizedRoute =
      route.toLowerCase();

    return (
      normalizedPathname ===
        normalizedRoute ||
      normalizedPathname.startsWith(
        `${normalizedRoute}/`
      )
    );
  });

  useEffect(() => {
    // Public pages don't need authentication checking
    if (!isProtectedRoute) {
      setCheckingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
  router.replace(
    `/auth?redirect=${encodeURIComponent(pathname)}`
  );
  return;
}

if (!currentUser.emailVerified) {
  router.replace(
    `/auth?verify=true&redirect=${encodeURIComponent(pathname)}`
  );
  return;
}

      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [isProtectedRoute, pathname, router]);

  // Show loading screen while checking authentication
  if (isProtectedRoute && (checkingAuth || !user)) {
    return (
      <div className="min-h-screen bg-[#F8F3EB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#29251F] text-xl font-semibold">
            Loading your workspace...
          </div>

          <div className="mt-3 text-[#9A9287] text-sm">
            Checking your account
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}