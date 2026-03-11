export default function CekiciPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6">
      <div className="flex flex-1 flex-col justify-between">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-primary">
            YOLDA • Çekici
          </p>
          <h1 className="text-2xl font-semibold">Çekici Paneli</h1>
          <p className="text-sm text-slate-400">
            Burada çekici firmaları; gelen talepleri görüp fiyat teklifi
            verecek, müşteri seçimini takip edecek.
          </p>
        </header>

        <section className="mt-8 space-y-4 text-sm text-slate-400">
          <p>- Gelen çekici talepleri listesi</p>
          <p>- Teklif oluşturma / güncelleme alanı</p>
        </section>
      </div>
    </main>
  );
}

