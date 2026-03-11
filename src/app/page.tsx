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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FF4500] to-[#FF7A00]">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center px-6 text-center text-white">
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-[0.3em]">
            YOLDA <span className="inline-block align-middle">🚗</span>
          </h1>
          <p className="text-sm font-medium uppercase tracking-[0.3em] opacity-90">
            Şoför · Çekici · Her Zaman Yanında
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 animate-dot rounded-full bg-white/80" />
          <span className="h-1.5 w-1.5 animate-dot rounded-full bg-white/80 [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 animate-dot rounded-full bg-white/80 [animation-delay:240ms]" />
        </div>
      </main>
    </div>
  );
}
