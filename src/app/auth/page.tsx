export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6">
      <div className="flex flex-1 flex-col justify-between">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-primary">
            YOLDA
          </p>
          <h1 className="text-2xl font-semibold">Giriş / Kayıt</h1>
          <p className="text-sm text-slate-400">
            Şimdilik sadece iskelet ekran. Buraya kimlik doğrulama akışı
            gelecek.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm text-slate-400">
          <p>- Müşteri, şoför ve çekici rolleri için giriş formları</p>
          <p>- Supabase Auth entegrasyonu</p>
        </section>
      </div>
    </main>
  );
}

