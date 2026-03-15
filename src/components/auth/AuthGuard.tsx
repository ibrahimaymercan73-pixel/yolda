"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          if (!cancelled)
            router.replace(
              `/auth/login?redirect=${encodeURIComponent(pathname)}`
            );
          return;
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Oturum kontrol edilirken bir hata oluştu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
        Oturum kontrol ediliyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return <>{children}</>;
}
