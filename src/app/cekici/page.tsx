export default function CekiciPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[var(--bg)] px-5 py-6">
      <div className="flex flex-1 flex-col justify-between">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
            YOLDA • Çekici
          </p>
          <h1
            className="text-[28px] font-extrabold text-[var(--text)]"
            style={{ letterSpacing: "-0.8px" }}
          >
            Çekici Paneli
          </h1>
          <p className="text-sm text-[var(--text-dim)]">
            Burada çekici firmaları; gelen talepleri görüp fiyat teklifi verecek,
            müşteri seçimini takip edecek.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm text-[var(--text-dim)]">
          <p>- Gelen çekici talepleri listesi</p>
          <p>- Teklif oluşturma / güncelleme alanı</p>
        </section>
      </div>
    </main>
  );
}
