"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #1C1C1E 0%, #2C2C2E 100%)",
      }}
    >
      <main className="flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center px-6 text-center">
        <div
          className="mb-4 flex h-[84px] w-[84px] items-center justify-center rounded-[26px] bg-white text-4xl"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
        >
          🚗
        </div>
        <h1
          className="text-[46px] font-extrabold leading-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          YOLDA
        </h1>
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Şoför · Çekici · Her Zaman Yanında
        </p>

        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pill rounded-full bg-white/60" />
          <span
            className="h-2 w-2 animate-pill rounded-full bg-white/60"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="h-2 w-2 animate-pill rounded-full bg-white/60"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </main>
    </div>
  );
}
