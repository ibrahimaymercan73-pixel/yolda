export default function SoforPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[var(--bg)] px-5 py-6">
      <div className="flex flex-1 flex-col justify-between">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
            YOLDA • Yedek Şoför
          </p>
          <h1
            className="text-[28px] font-extrabold text-[var(--text)]"
            style={{ letterSpacing: "-0.8px" }}
          >
            Şoför Paneli
          </h1>
          <p className="text-sm text-[var(--text-dim)]">
            Burada şoför; aktif çağrıları, müşteri konumunu ve yolculuk durumunu
            görecek.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm text-[var(--text-dim)]">
          <p>- Aktif / bekleyen talepler</p>
          <p>- Başlat / bitir butonları</p>
        </section>
      </div>
    </main>
  );
}
