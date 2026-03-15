import { AuthGuard } from "@/components/auth/AuthGuard";

export default function MusteriLayout({
  children,
}: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
