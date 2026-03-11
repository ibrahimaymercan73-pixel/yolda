export default function SoforPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6">
      <div className="flex flex-1 flex-col justify-between">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-success">
            YOLDA • Yedek Şoför
          </p>
          <h1 className="text-2xl font-semibold">Şoför Paneli</h1>
          <p className="text-sm text-slate-400">
            Burada şoför; aktif çağrıları, müşteri konumunu ve yolculuk
            durumunu görecek.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm text-slate-400">
          <p>- Aktif / bekleyen talepler</p>
          <p>- Başlat / bitir butonları</p>
        </section>
      </div>
    </main>
  );
}

