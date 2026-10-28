"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

type AuthMode =
  | "login"
  | "register"
  | "verify"
  | "welcome"
  | "reset";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [transitioning, setTransitioning] = useState(false);

  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // REGISTER
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // PASSWORD RESET
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // VERIFICATION
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationLoading, setVerificationLoading] =
    useState(false);
  const [verificationChecking, setVerificationChecking] =
    useState(false);
  const [verificationMessage, setVerificationMessage] =
    useState("");

  // WELCOME
  const [welcomeName, setWelcomeName] = useState("");

  /* =========================================================
     AUTH STATE
  ========================================================== */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) return;

        try {
          await reload(user);

          if (user.emailVerified) {
            return;
          }

          if (
            mode !== "register" &&
            mode !== "reset"
          ) {
            setVerificationEmail(user.email || "");
            setMode("verify");
          }
        } catch (error) {
          console.error("Auth state error:", error);
        }
      }
    );

    return () => unsubscribe();
  }, [mode]);

  /* =========================================================
     MODE TRANSITION
  ========================================================== */

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode || transitioning) return;

    setTransitioning(true);

    window.setTimeout(() => {
      setMode(nextMode);
    }, 300);

    window.setTimeout(() => {
      setTransitioning(false);
    }, 750);
  };

  /* =========================================================
     LOGIN
  ========================================================== */

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoginLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await reload(user);

      if (!user.emailVerified) {
        setVerificationEmail(
          user.email || email
        );

        setVerificationMessage(
          "Please verify your email before accessing your workspace."
        );

        setMode("verify");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName || "",
          email: user.email,
          uid: user.uid,
        })
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
          alert("Incorrect email or password.");
          break;

        case "auth/user-not-found":
          alert("No account found with this email.");
          break;

        case "auth/wrong-password":
          alert("Incorrect password.");
          break;

        case "auth/invalid-email":
          alert(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          alert(
            "Too many attempts. Please try again later."
          );
          break;

        default:
          alert(
            "Unable to sign in. Please try again."
          );
      }
    } finally {
      setLoginLoading(false);
    }
  };

  /* =========================================================
     CREATE ACCOUNT
  ========================================================== */

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const fullName = name.trim();
    const email = registerEmail.trim().toLowerCase();
    const password = registerPassword;

    if (!fullName || !email || !password) {
      alert("Please complete all required fields.");
      return;
    }

    // Password requirements
    if (password.length < 8) {
      alert(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert(
        "Password must contain at least 1 uppercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      alert(
        "Password must contain at least 1 number."
      );
      return;
    }

    try {
      setRegisterLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      await sendEmailVerification(user);

      setVerificationEmail(
        user.email || email
      );

      setVerificationMessage(
        "Verification email sent. Please check your inbox."
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: fullName,
          email: user.email,
          uid: user.uid,
        })
      );

      localStorage.removeItem("isLoggedIn");

      setWelcomeName(fullName);
      setMode("verify");
    } catch (error: any) {
      console.error(
        "Registration error:",
        error
      );

      switch (error.code) {
        case "auth/email-already-in-use":
          alert(
            "An account already exists with this email."
          );
          break;

        case "auth/invalid-email":
          alert(
            "Please enter a valid email address."
          );
          break;

        case "auth/weak-password":
          alert(
            "Password must contain at least 8 characters."
          );
          break;

        case "auth/operation-not-allowed":
          alert(
            "Email/password authentication is not enabled in Firebase."
          );
          break;

        default:
          alert(
            "Unable to create your account. Please try again."
          );
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  /* =========================================================
     PASSWORD RESET
  ========================================================== */

  const handlePasswordReset = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const email = resetEmail.trim().toLowerCase();

    setResetMessage("");
    setResetSuccess(false);

    if (!email) {
      setResetMessage(
        "Please enter your email address."
      );
      return;
    }

    try {
      setResetLoading(true);

      await sendPasswordResetEmail(
        auth,
        email
      );

      /*
       * Firebase sends the password-reset email.
       *
       * We intentionally show a generic success
       * message rather than revealing whether an
       * account exists for the supplied email.
       */
      setResetSuccess(true);

      setResetMessage(
        "If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder."
      );
    } catch (error: any) {
      console.error(
        "Password reset error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-email":
          setResetMessage(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setResetMessage(
            "Too many password reset requests. Please wait before trying again."
          );
          break;

        case "auth/network-request-failed":
          setResetMessage(
            "Network error. Please check your connection and try again."
          );
          break;

        /*
         * We intentionally do not expose
         * auth/user-not-found to avoid account
         * enumeration.
         */
        case "auth/user-not-found":
          setResetSuccess(true);
          setResetMessage(
            "If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder."
          );
          break;

        default:
          setResetMessage(
            "Unable to send the password reset email. Please try again later."
          );
          break;
      }
    } finally {
      setResetLoading(false);
    }
  };

  /* =========================================================
     CHECK EMAIL VERIFICATION
  ========================================================== */

  const handleCheckVerification = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMode("login");
      return;
    }

    try {
      setVerificationChecking(true);
      setVerificationMessage("");

      await reload(user);

      if (!user.emailVerified) {
        setVerificationMessage(
          "Your email is not verified yet. Please check your inbox and click the verification link."
        );
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name:
            user.displayName ||
            welcomeName ||
            "",
          email: user.email,
          uid: user.uid,
        })
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      setMode("welcome");
    } catch (error) {
      console.error(
        "Verification check error:",
        error
      );

      setVerificationMessage(
        "Unable to check verification status. Please try again."
      );
    } finally {
      setVerificationChecking(false);
    }
  };

  /* =========================================================
     RESEND VERIFICATION EMAIL
  ========================================================== */

  const handleResendVerification = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert(
        "Your session has expired. Please sign in again."
      );

      setMode("login");
      return;
    }

    try {
      setVerificationLoading(true);
      setVerificationMessage("");

      await reload(user);

      if (user.emailVerified) {
        setVerificationMessage(
          "Your email is already verified."
        );
        return;
      }

      await sendEmailVerification(user);

      setVerificationMessage(
        "A new verification email has been sent. Please check your inbox."
      );
    } catch (error: any) {
      console.error(
        "Resend verification error:",
        error
      );

      if (
        error.code ===
        "auth/too-many-requests"
      ) {
        setVerificationMessage(
          "Too many verification emails were requested. Please wait before trying again."
        );
      } else {
        setVerificationMessage(
          "Unable to send the verification email. Please try again."
        );
      }
    } finally {
      setVerificationLoading(false);
    }
  };

  /* =========================================================
     LOG OUT FROM VERIFICATION
  ========================================================== */

  const handleVerificationLogout =
    async () => {
      try {
        await signOut(auth);

        localStorage.removeItem(
          "isLoggedIn"
        );

        localStorage.removeItem("user");

        setVerificationEmail("");
        setVerificationMessage("");
        setMode("login");
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    };

  /* =========================================================
     WELCOME → DASHBOARD
  ========================================================== */

  const handleGetStarted = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMode("login");
      return;
    }

    await reload(user);

    if (!user.emailVerified) {
      setVerificationEmail(
        user.email || ""
      );

      setMode("verify");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4EBDD] text-[#29251F]">

      {/* =====================================================
          GLOBAL BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-60 -top-60 h-[720px] w-[720px] rounded-full bg-[#E2C7A9]/30 blur-[130px] animate-[authAmbientOne_16s_ease-in-out_infinite]" />

        <div className="absolute -right-60 bottom-[-250px] h-[720px] w-[720px] rounded-full bg-[#C99567]/10 blur-[140px] animate-[authAmbientTwo_19s_ease-in-out_infinite]" />

        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FBF7F0]/60 blur-[120px] animate-[authAmbientThree_20s_ease-in-out_infinite]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#9A8568 1px, transparent 1px), linear-gradient(90deg, #9A8568 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

      </div>

      {/* =====================================================
          BRAND
      ====================================================== */}

      <div className="relative z-20 mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-5 sm:px-0">

        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-3 border-0 bg-transparent p-0"
        >

          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#24211E] shadow-[0_8px_25px_rgba(36,33,30,0.15)]">

            <span className="text-[16px] text-[#E8C5A4]">
              ✦
            </span>

          </div>

          <div className="text-left">

            <p className="text-[12px] font-semibold tracking-[0.08em] text-[#29251F]">
              AI STARTUP CO-PILOT
            </p>

            <p className="text-[8px] tracking-[0.25em] text-[#9A9287]">
              INTELLIGENCE PLATFORM
            </p>

          </div>

        </button>

        <div className="hidden items-center gap-2 text-[9px] font-semibold tracking-[0.17em] text-[#8D7B6B] sm:flex">

          <span className="h-1.5 w-1.5 rounded-full bg-[#C99567]" />

          SECURE ACCESS

        </div>

      </div>

      {/* =====================================================
          AUTH CONTAINER
      ====================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-78px)] items-center justify-center px-4 pb-7 sm:px-6">

        <div className="relative w-full max-w-[1100px]">

          <div className="absolute -inset-5 rounded-[2.6rem] bg-[#8B6445]/8 blur-3xl" />

          <div
            className={`relative overflow-hidden rounded-[2.3rem] border shadow-[0_42px_120px_rgba(57,43,30,0.18)] ${
              mode === "login"
                ? "border-[#4C433B] bg-[#24211E]"
                : "border-[#D2C4B3] bg-[#FBF7F0]"
            }`}
          >

            {/* =================================================
                LOGIN / REGISTER SWITCHER
            ================================================== */}

            {mode !== "welcome" &&
              mode !== "verify" &&
              mode !== "reset" && (
                <div
                  className={`absolute left-1/2 top-6 z-30 flex -translate-x-1/2 items-center rounded-full p-1 ${
                    mode === "login"
                      ? "border border-[#4A433C] bg-[#1E1B18]/90"
                      : "border border-[#D8CCBC] bg-[#F1E7D9]/95"
                  }`}
                >

                  <button
                    type="button"
                    disabled={transitioning}
                    onClick={() =>
                      switchMode("login")
                    }
                    className={`rounded-full px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${
                      mode === "login"
                        ? "bg-[#39332D] text-[#F8F3EB]"
                        : "text-[#8D8175]"
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    disabled={transitioning}
                    onClick={() =>
                      switchMode("register")
                    }
                    className={`rounded-full px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${
                      mode === "register"
                        ? "bg-[#E9E0D2] text-[#29251F]"
                        : "text-[#8D8175]"
                    }`}
                  >
                    Create Account
                  </button>

                </div>
              )}

            {/* =================================================
                LOGIN
            ================================================== */}

            {mode === "login" && (
              <div className="grid min-h-[640px] lg:grid-cols-[0.82fr_1.18fr]">

                {/* LEFT LOGIN VISUAL */}

                <div className="relative hidden overflow-hidden border-r border-[#403932] lg:block">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(201,149,103,0.14),transparent_53%)]" />

                  <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C99567]/10 animate-[authOrbitOne_28s_linear_infinite]" />

                  <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#C99567]/15 animate-[authOrbitTwo_20s_linear_infinite]" />

                  <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 animate-[authPulse_7s_ease-in-out_infinite]">

                    <div className="absolute inset-0 flex items-center justify-center">

                      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#C99567]/35 bg-[#302B26] shadow-[0_0_80px_rgba(201,149,103,.18)]">

                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#D8A97B] to-[#9A6535] shadow-[0_0_35px_rgba(201,149,103,.4)] animate-[authCorePulse_4s_ease-in-out_infinite]" />

                        <span className="absolute text-2xl text-[#F8F3EB]">
                          ✦
                        </span>

                      </div>

                    </div>

                  </div>

                  <SignalCard
                    label="MARKET"
                    value="94.2"
                    note="Momentum +12%"
                    dark
                    className="left-7 top-[30%] animate-[authFloatOne_6s_ease-in-out_infinite]"
                  />

                  <SignalCard
                    label="AI ENGINE"
                    value="ONLINE"
                    note="7ms latency"
                    dark
                    className="bottom-[25%] right-7 animate-[authFloatTwo_7s_ease-in-out_infinite]"
                  />

                  <div className="absolute bottom-8 left-7">

                    <p className="text-[8px] font-semibold tracking-[0.22em] text-[#8D8175]">
                      AI INTELLIGENCE CORE
                    </p>

                    <p className="mt-1 text-[10px] text-[#655D56]">
                      Analyze · Validate · Decide
                    </p>

                  </div>

                </div>

                {/* LOGIN FORM */}

                <div className="relative flex min-h-[640px] items-center overflow-hidden bg-[#24211E] px-7 py-20 sm:px-12">

                  {/* LOGIN BACKGROUND */}

                  <div className="pointer-events-none absolute inset-0">

                    <div className="absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full bg-[#C99567]/10 blur-[90px] animate-[authLoginGlowOne_11s_ease-in-out_infinite]" />

                    <div className="absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-[#8B6445]/10 blur-[100px] animate-[authLoginGlowTwo_14s_ease-in-out_infinite]" />

                    <div className="absolute left-[65%] top-[45%] h-[180px] w-[180px] rounded-full border border-[#C99567]/[0.07] animate-[authLoginRing_18s_linear_infinite]" />

                    <div className="absolute left-[65%] top-[45%] h-[270px] w-[270px] rounded-full border border-[#C99567]/[0.04] animate-[authLoginRingReverse_24s_linear_infinite]" />

                  </div>

                  <div className="relative z-10 mx-auto w-full max-w-[420px]">

                    <p className="text-[9px] font-semibold tracking-[0.26em] text-[#C99567]">
                      FOUNDER ACCESS
                    </p>

                    <h1 className="mt-4 font-serif text-[42px] font-normal leading-[1.04] text-[#F8F3EB]">
                      Welcome back.
                    </h1>

                    <p className="mt-4 max-w-sm text-[14px] leading-6 text-[#AAA198]">
                      Step back into your founder workspace
                      and continue making smarter decisions.
                    </p>

                    <form
                      className="mt-9 space-y-5"
                      onSubmit={handleLogin}
                    >

                      <DarkField
                        id="login-email"
                        label="Email address"
                        type="email"
                        placeholder="founder@company.com"
                        value={loginEmail}
                        onChange={setLoginEmail}
                        autoComplete="email"
                      />

                      <DarkField
                        id="login-password"
                        label="Password"
                        type="password"
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={setLoginPassword}
                        autoComplete="current-password"
                      />

                      {/* FORGOT PASSWORD */}

                      <div className="-mt-1 flex justify-end">

                        <button
                          type="button"
                          onClick={() => {
                            setResetEmail(
                              loginEmail
                            );
                            setResetMessage("");
                            setResetSuccess(false);
                            switchMode("reset");
                          }}
                          className="border-0 bg-transparent p-0 text-[11px] font-semibold text-[#C99567] transition hover:text-[#D8A97B]"
                        >
                          Forgot your password?
                        </button>

                      </div>

                      <AuthButton
                        loading={loginLoading}
                        text="Access Co-Pilot"
                        loadingText="Authenticating..."
                      />

                    </form>

                    <div className="mt-8 border-t border-[#403932] pt-6">

                      <p className="text-[12px] text-[#81776F]">
                        New to the platform?
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          switchMode("register")
                        }
                        className="mt-2 border-0 bg-transparent p-0 text-[13px] font-semibold text-[#C99567]"
                      >
                        Create your founder workspace →
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                REGISTER
            ================================================== */}

            {mode === "register" && (
              <div className="relative min-h-[640px] overflow-hidden bg-[#F1E4D4]">

                {/* REGISTER BACKGROUND */}

                <div className="pointer-events-none absolute inset-0">

                  <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#C99567]/16 blur-[90px] animate-[authRegisterGlowOne_12s_ease-in-out_infinite]" />

                  <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#E8CDB0]/45 blur-[100px] animate-[authRegisterGlowTwo_15s_ease-in-out_infinite]" />

                  <div className="absolute left-[70%] top-[25%] h-[230px] w-[230px] rounded-full border border-[#A7744B]/[0.09] animate-[authRegisterOrbit_22s_linear_infinite]" />

                  <div className="absolute left-[70%] top-[25%] h-[330px] w-[330px] rounded-full border border-[#A7744B]/[0.05] animate-[authRegisterOrbitReverse_30s_linear_infinite]" />

                  <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#8B6445 1px, transparent 1px), linear-gradient(90deg, #8B6445 1px, transparent 1px)",
                      backgroundSize: "70px 70px",
                    }}
                  />

                </div>

                <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-[780px] flex-col justify-center px-7 py-24 sm:px-12 lg:px-16">

                  <div>

                    <div className="mb-4 flex items-center gap-3">

                      <span className="h-px w-10 bg-[#C99567]" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A7744B]">
                        FOUNDER INITIALIZATION
                      </span>

                    </div>

                    <h1 className="font-serif text-[44px] leading-[1.04] text-[#29251F] sm:text-[52px]">
                      Create your
                      <br />
                      founder workspace.
                    </h1>

                    <p className="mt-5 max-w-[540px] text-[14px] leading-7 text-[#746C63]">
                      Start with the essentials. Your startup
                      details can be added later from your workspace.
                    </p>

                  </div>

                  <form
                    className="mt-9"
                    onSubmit={handleRegister}
                  >

                    <div className="grid gap-5 sm:grid-cols-2">

                      <LightField
                        id="register-name"
                        label="Full Name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={setName}
                        autoComplete="name"
                      />

                      <LightField
                        id="register-email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={registerEmail}
                        onChange={setRegisterEmail}
                        autoComplete="email"
                      />

                      <div className="sm:col-span-2">

                        <LightField
                          id="register-password"
                          label="Password"
                          type="password"
                          placeholder="Create a secure password"
                          value={registerPassword}
                          onChange={setRegisterPassword}
                          autoComplete="new-password"
                        />

                      </div>

                    </div>

                    {/* PASSWORD REQUIREMENTS */}

                    <div className="mt-5 rounded-xl border border-[#D2C1AF] bg-[#FBF5EC]/70 px-4 py-3">

                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8C7968]">
                        Password requirements
                      </p>

                      <div className="mt-2 grid gap-1 sm:grid-cols-3">

                        <span className="text-[10px] text-[#8D8175]">
                          • 8+ characters
                        </span>

                        <span className="text-[10px] text-[#8D8175]">
                          • 1 uppercase letter
                        </span>

                        <span className="text-[10px] text-[#8D8175]">
                          • 1 number
                        </span>

                      </div>

                    </div>

                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="text-[10px] text-[#9A9287]">
                        Your account will be secured with Firebase Authentication.
                      </div>

                      <LightSubmitButton
                        loading={registerLoading}
                        text="Create Account"
                        loadingText="Creating Account..."
                      />

                    </div>

                  </form>

                  <div className="mt-8 flex items-center justify-between border-t border-[#D8CCBC] pt-6">

                    <p className="text-[11px] text-[#8D8175]">
                      Already have an account?
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        switchMode("login")
                      }
                      className="border-0 bg-transparent p-0 text-[12px] font-semibold text-[#A7744B]"
                    >
                      Sign In →
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                PASSWORD RESET
            ================================================== */}

            {mode === "reset" && (
              <div className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-[#FBF7F0] px-6 py-20">

                {/* RESET BACKGROUND */}

                <div className="pointer-events-none absolute inset-0">

                  <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#C99567]/10 blur-[100px] animate-[authResetGlowOne_12s_ease-in-out_infinite]" />

                  <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#E8D7C3]/50 blur-[110px] animate-[authResetGlowTwo_15s_ease-in-out_infinite]" />

                  <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C99567]/[0.06] animate-[authResetRing_24s_linear_infinite]" />

                </div>

                <div className="relative z-10 w-full max-w-[480px]">

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#C99567]/30 bg-[#29251F] shadow-[0_0_70px_rgba(201,149,103,.18)]">

                    <span className="text-4xl text-[#E3B98F]">
                      ↻
                    </span>

                  </div>

                  <p className="mt-9 text-center text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A7744B]">
                    ACCOUNT RECOVERY
                  </p>

                  <h1 className="mt-4 text-center font-serif text-[42px] leading-[1.05] text-[#29251F] sm:text-[50px]">
                    Reset your password.
                  </h1>

                  <p className="mx-auto mt-5 max-w-[430px] text-center text-[14px] leading-7 text-[#746C63]">
                    Enter the email address associated with
                    your founder workspace and we will send
                    you a secure password reset link.
                  </p>

                  <form
                    className="mt-8 space-y-5"
                    onSubmit={
                      handlePasswordReset
                    }
                  >

                    <LightField
                      id="reset-email"
                      label="Email address"
                      type="email"
                      placeholder="founder@company.com"
                      value={resetEmail}
                      onChange={(value) => {
                        setResetEmail(value);
                        setResetMessage("");
                        setResetSuccess(false);
                      }}
                      autoComplete="email"
                    />

                    {resetMessage && (
                      <div
                        className={`rounded-xl border px-4 py-3 text-[11px] leading-5 ${
                          resetSuccess
                            ? "border-[#B9CDB8] bg-[#EEF5EC] text-[#5F715C]"
                            : "border-[#D8CCBC] bg-[#F6EEE3] text-[#746C63]"
                        }`}
                      >
                        {resetMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#29251F] py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F8F3EB] shadow-[0_16px_40px_rgba(41,37,31,.15)] transition hover:bg-[#39332D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {resetLoading
                        ? "Sending Reset Link..."
                        : "Send Reset Link"}

                      {!resetLoading && (
                        <span className="text-lg text-[#D8A97B]">
                          →
                        </span>
                      )}
                    </button>

                  </form>

                  <div className="mt-8 border-t border-[#D8CCBC] pt-6 text-center">

                    <button
                      type="button"
                      onClick={() => {
                        setResetMessage("");
                        setResetSuccess(false);
                        switchMode("login");
                      }}
                      className="border-0 bg-transparent p-0 text-[12px] font-semibold text-[#A7744B] transition hover:text-[#8B6445]"
                    >
                      ← Back to Sign In
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                EMAIL VERIFICATION
            ================================================== */}

            {mode === "verify" && (
              <div className="relative flex min-h-[640px] items-center justify-center bg-[#FBF7F0] px-6 py-20 text-center">

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8D7C3]/50 blur-[100px] animate-[authVerifyGlow_8s_ease-in-out_infinite]" />

                <div className="relative z-10 w-full max-w-[520px]">

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#C99567]/30 bg-[#29251F] shadow-[0_0_70px_rgba(201,149,103,.20)]">

                    <span className="text-4xl text-[#E3B98F]">
                      ✉
                    </span>

                  </div>

                  <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A7744B]">
                    EMAIL VERIFICATION REQUIRED
                  </p>

                  <h1 className="mt-4 font-serif text-[42px] leading-[1.05] text-[#29251F] sm:text-[50px]">
                    Verify your email.
                  </h1>

                  <p className="mx-auto mt-5 max-w-[470px] text-[14px] leading-7 text-[#746C63]">
                    We sent a verification link to:
                  </p>

                  <div className="mx-auto mt-4 w-fit rounded-xl border border-[#D8CCBC] bg-[#F1E7D9] px-5 py-3 text-[13px] font-semibold text-[#29251F]">
                    {verificationEmail}
                  </div>

                  <p className="mx-auto mt-5 max-w-[470px] text-[12px] leading-6 text-[#8D8175]">
                    Open the email and click the verification
                    link. After verifying, return here and click
                    <strong className="text-[#746C63]">
                      {" "}“I Verified My Email”.
                    </strong>
                  </p>

                  {verificationMessage && (
                    <div className="mx-auto mt-6 max-w-[470px] rounded-xl border border-[#D8CCBC] bg-[#F6EEE3] px-4 py-3 text-[11px] leading-5 text-[#746C63]">
                      {verificationMessage}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3">

                    <button
                      type="button"
                      onClick={
                        handleCheckVerification
                      }
                      disabled={
                        verificationChecking
                      }
                      className="w-full rounded-xl bg-[#29251F] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F8F3EB] transition hover:bg-[#39332D] disabled:opacity-60"
                    >
                      {verificationChecking
                        ? "Checking..."
                        : "I Verified My Email →"}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleResendVerification
                      }
                      disabled={
                        verificationLoading
                      }
                      className="w-full rounded-xl border border-[#C99567] bg-transparent px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A7744B] transition hover:bg-[#F1E7D9] disabled:opacity-60"
                    >
                      {verificationLoading
                        ? "Sending..."
                        : "Resend Verification Email"}
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleVerificationLogout
                    }
                    className="mt-7 text-[11px] font-semibold text-[#8D8175] hover:text-[#A7744B]"
                  >
                    Use a different account
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                WELCOME
            ================================================== */}

            {mode === "welcome" && (
              <div className="relative min-h-[640px] overflow-hidden bg-[#FBF7F0]">

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8D7C3]/55 blur-[100px] animate-[authWelcomeGlow_9s_ease-in-out_infinite]" />

                <div className="relative flex min-h-[640px] flex-col items-center justify-center px-6 py-20 text-center">

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#C99567]/30 bg-[#29251F] shadow-[0_0_80px_rgba(201,149,103,.20)] animate-[authWelcomePulse_5s_ease-in-out_infinite]">

                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#E3B98F] to-[#A7744B]" />

                    <span className="absolute text-2xl text-[#F8F3EB]">
                      ✦
                    </span>

                  </div>

                  <p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A7744B]">
                    WELCOME TO YOUR WORKSPACE
                  </p>

                  <h1 className="mt-4 font-serif text-[44px] text-[#29251F] sm:text-[56px]">
                    Welcome,
                    <br />
                    {welcomeName || "Founder"}.
                  </h1>

                  <p className="mt-5 max-w-[540px] text-[14px] leading-7 text-[#746C63]">
                    Your AI co-pilot is ready to help you
                    analyze ideas, validate opportunities,
                    and make smarter startup decisions.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleGetStarted
                    }
                    className="mt-10 rounded-xl bg-[#29251F] px-9 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F8F3EB] shadow-[0_16px_40px_rgba(41,37,31,.20)] transition hover:bg-[#39332D]"
                  >
                    Enter Workspace →
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx>{`

        /* GLOBAL */

        @keyframes authAmbientOne {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: .35;
          }

          50% {
            transform: translate3d(45px, 35px, 0) scale(1.12);
            opacity: .65;
          }
        }

        @keyframes authAmbientTwo {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: .25;
          }

          50% {
            transform: translate3d(-40px, -30px, 0) scale(1.12);
            opacity: .55;
          }
        }

        @keyframes authAmbientThree {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: .45;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: .75;
          }
        }

        /* LOGIN VISUAL */

        @keyframes authOrbitOne {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes authOrbitTwo {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes authPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(.96);
            opacity: .82;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 1;
          }
        }

        @keyframes authCorePulse {
          0%, 100% {
            transform: scale(.9);
            opacity: .75;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes authFloatOne {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes authFloatTwo {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(10px);
          }
        }

        /* LOGIN BACKGROUND */

        @keyframes authLoginGlowOne {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: .35;
          }

          50% {
            transform: translate(-55px, 50px) scale(1.18);
            opacity: .75;
          }
        }

        @keyframes authLoginGlowTwo {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: .25;
          }

          50% {
            transform: translate(45px, -40px) scale(1.15);
            opacity: .6;
          }
        }

        @keyframes authLoginRing {
          from {
            transform: rotate(0deg) translateX(12px);
          }

          to {
            transform: rotate(360deg) translateX(12px);
          }
        }

        @keyframes authLoginRingReverse {
          from {
            transform: rotate(360deg) translateX(-10px);
          }

          to {
            transform: rotate(0deg) translateX(-10px);
          }
        }

        /* REGISTER BACKGROUND */

        @keyframes authRegisterGlowOne {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: .35;
          }

          50% {
            transform: translate(65px, 45px) scale(1.2);
            opacity: .7;
          }
        }

        @keyframes authRegisterGlowTwo {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: .35;
          }

          50% {
            transform: translate(-50px, -40px) scale(1.15);
            opacity: .65;
          }
        }

        @keyframes authRegisterOrbit {
          from {
            transform: rotate(0deg) translateX(10px);
          }

          to {
            transform: rotate(360deg) translateX(10px);
          }
        }

        @keyframes authRegisterOrbitReverse {
          from {
            transform: rotate(360deg) translateX(-8px);
          }

          to {
            transform: rotate(0deg) translateX(-8px);
          }
        }

        /* PASSWORD RESET */

        @keyframes authResetGlowOne {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: .3;
          }

          50% {
            transform: translate(55px, 45px) scale(1.16);
            opacity: .65;
          }
        }

        @keyframes authResetGlowTwo {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: .3;
          }

          50% {
            transform: translate(-45px, -35px) scale(1.14);
            opacity: .6;
          }
        }

        @keyframes authResetRing {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        /* VERIFICATION */

        @keyframes authVerifyGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: .45;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.12);
            opacity: .8;
          }
        }

        /* WELCOME */

        @keyframes authWelcomeGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: .4;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.12);
            opacity: .75;
          }
        }

        @keyframes authWelcomePulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.06);
          }
        }

      `}</style>

    </main>
  );
}

/* =========================================================
   DARK FIELD
========================================================= */

function DarkField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.17em] text-[#BDB2A8]"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        autoComplete={autoComplete}
        required
        className="w-full rounded-xl border border-[#665A50] bg-[#332D27] px-4 py-3.5 text-[13px] text-[#F8F3EB] outline-none placeholder:text-[#A29589] focus:border-[#C99567] focus:ring-4 focus:ring-[#C99567]/10"
      />

    </div>
  );
}

/* =========================================================
   LIGHT FIELD
========================================================= */

function LightField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8C7968]"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        autoComplete={autoComplete}
        required
        className="w-full rounded-2xl border border-[#D2C4B4] bg-[#FDF9F3] px-4 py-4 text-[13px] text-[#29251F] outline-none placeholder:text-[#A99C90] focus:border-[#C99567] focus:bg-white"
      />

    </div>
  );
}

/* =========================================================
   LOGIN BUTTON
========================================================= */

function AuthButton({
  loading,
  text,
  loadingText,
}: {
  loading: boolean;
  text: string;
  loadingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#C99567] py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#24211E] transition hover:bg-[#D8A97B] disabled:opacity-70"
    >
      {loading ? loadingText : text}

      {!loading && (
        <span className="text-lg">
          →
        </span>
      )}
    </button>
  );
}

/* =========================================================
   REGISTER BUTTON
========================================================= */

function LightSubmitButton({
  loading,
  text,
  loadingText,
}: {
  loading: boolean;
  text: string;
  loadingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#24211E] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F8F3EB] transition hover:bg-[#39332D] disabled:opacity-70"
    >
      {loading ? loadingText : text}

      {!loading && (
        <span className="text-lg text-[#D8A97B]">
          →
        </span>
      )}
    </button>
  );
}

/* =========================================================
   SIGNAL CARD
========================================================= */

function SignalCard({
  label,
  value,
  note,
  dark,
  className,
}: {
  label: string;
  value: string;
  note: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`absolute ${className} rounded-xl px-4 py-3 backdrop-blur-md ${
        dark
          ? "border border-[#5A4E44] bg-[#302A25]/80"
          : "border border-[#D8CCBC] bg-[#FBF7F0]/85"
      }`}
    >

      <p
        className={`text-[8px] uppercase tracking-[0.16em] ${
          dark
            ? "text-[#958A80]"
            : "text-[#9A9287]"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1 font-serif text-[19px] ${
          dark
            ? "text-[#F8F3EB]"
            : "text-[#29251F]"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[9px] text-[#C99567]">
        {note}
      </p>

    </div>
  );
}