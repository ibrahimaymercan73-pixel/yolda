export default function MusteriPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6">
      <div className="flex flex-1 flex-col justify-between">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-primary">
            YOLDA • Müşteri
          </p>
          <h1 className="text-2xl font-semibold">
            Hizmet Seçimi (Müşteri Paneli)
          </h1>
          <p className="text-sm text-slate-400">
            Burada müşteri; yedek şoför çağırma veya çekici için talep
            oluşturma adımlarını görecek.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm text-slate-400">
          <p>- Konum seçimi</p>
          <p>- Araç bilgileri</p>
          <p>- Yedek şoför / çekici senaryosu seçimi</p>
        </section>
      </div>
    </main>
  );
}

