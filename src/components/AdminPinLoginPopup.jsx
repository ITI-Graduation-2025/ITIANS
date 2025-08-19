"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signIn } from "next-auth/react";
import { auth } from "@/config/firebase";

export default function AdminPinLoginPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const expectedPin = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_PIN ?? "",
    [],
  );
  const adminEmail = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "",
    [],
  );
  const adminPassword = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "",
    [],
  );

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleOpen = () => {
    setPin("");
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setOpen(false);
  };

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(digits);
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }
    if (pin !== expectedPin) {
      setError("Invalid PIN. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (!adminEmail || !adminPassword) {
        throw new Error("Missing admin credentials env vars");
      }

      // Use NextAuth credentials to establish app session
      const result = await signIn("credentials", {
        email: adminEmail,
        password: adminPassword,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Login failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch (e) {
      setError("Login failed. Please check your admin settings.");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      if (!isSubmitting) handleClose();
    }
  };

  return (
    <>
      {/* Floating icon button bottom-right */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Admin PIN Login"
        className="fixed bottom-4 right-4 z-40 h-11 w-11 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg flex items-center justify-center hover:opacity-90"
      >
        {/* Lock icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9zm3 4a2 2 0 110 4 2 2 0 010-4z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          onKeyDown={handleKeyDown}
        >
          {/* Overlay */}
          <div
            className={[
              "absolute inset-0 bg-black/60 transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Content */}
          <div
            className={[
              "relative z-[1001] w-full max-w-sm rounded-xl p-6 shadow-xl",
              "bg-[var(--card)] text-[var(--card-foreground)] transition-all duration-300",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-pin-title"
          >
            <h2
              id="admin-pin-title"
              className="text-lg font-semibold mb-4 text-center text-[var(--foreground)]"
            >
              Admin Login PIN
            </h2>

            <div className="space-y-2">
              <label htmlFor="admin-pin" className="sr-only">
                Admin PIN
              </label>
              <input
                id="admin-pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={pin}
                onChange={handleChange}
                placeholder="••••"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-center tracking-widest text-lg outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || pin.length !== 4}
              className="mt-4 w-full rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-90"
            >
              {isSubmitting ? (
                <span className="relative inline-block font-bold pb-1 bg-gradient-to-r from-current to-current bg-[length:0%_3px] bg-no-repeat bg-bottom animate-[l2_2s_linear_infinite]">
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
