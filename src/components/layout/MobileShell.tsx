import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/musteri", label: "Müşteri" },
  { href: "/sofor", label: "Şoför" },
  { href: "/cekici", label: "Çekici" },
  { href: "/auth", label: "Giriş" },
];

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              YOLDA
            </span>
            <p className="text-xs text-slate-400">Yedek şoför & çekici</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4">{children}</main>

      <nav className="sticky bottom-0 border-t border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2 text-xs">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center rounded-md px-2 py-1 ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-400"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

