"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SoforIsteIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/musteri/sofor-iste/konum");
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center justify-center px-5 py-6">
        <p className="text-sm font-semibold text-[var(--text-dim)]">
          Yönlendiriliyor...
        </p>
      </main>
    </div>
  );
}

