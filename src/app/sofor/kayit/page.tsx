"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"] as const;
type Step = 1 | 2 | 3 | 4;

function ProgressBar({ step }: { step: Step }) {
  const pct = (step / 4) * 100;
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-dim)]">
        <span>{step}/4</span>
        <span className="text-[var(--text-muted)]">Kayıt</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
        <div className="h-full rounded-full bg-[#111]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default function SoforKayitPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState<(typeof CITIES)[number] | "">("");

  // Step 2
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseClass, setLicenseClass] = useState<"B" | "B1" | "">("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [licenseFront, setLicenseFront] = useState<{ path: string; name: string } | null>(null);
  const [licenseBack, setLicenseBack] = useState<{ path: string; name: string } | null>(null);
  const [uploading2, setUploading2] = useState<null | "front" | "back">(null);

  // Step 3
  const [tcNo, setTcNo] = useState("");
  const [idFront, setIdFront] = useState<{ path: string; name: string } | null>(null);
  const [noCriminalRecord, setNoCriminalRecord] = useState(false);
  const [uploading3, setUploading3] = useState(false);

  // Step 4
  const [iban, setIban] = useState("");
  const [accountName, setAccountName] = useState("");

  const canStep1 = fullName.trim().length >= 3 && birthDate && city;
  const canStep2 =
    licenseNo.trim().length >= 5 &&
    !!licenseClass &&
    !!licenseExpiry &&
    !!licenseFront &&
    !!licenseBack;
  const canStep3 = tcNo.replace(/\D/g, "").length === 11 && !!idFront && noCriminalRecord;
  const canStep4 = iban.trim().toUpperCase().startsWith("TR") && accountName.trim().length >= 3;

  const header = useMemo(() => {
    return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
          Şoför Kayıt
        </p>
        <h1 className="mt-1 text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>
          Başvuru
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Bilgilerini tamamla, belgelerini yükle.
        </p>
        <ProgressBar step={step} />
      </div>
    );
  }, [step]);

  const next = () => setStep((s) => (Math.min(4, s + 1) as Step));
  const back = () => setStep((s) => (Math.max(1, s - 1) as Step));

  const handleUploadLicenseFront = async (file: File) => {
    setError(null);
    setUploading2("front");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/sofor");
        return;
      }

      const userId = session.user.id;
      const fileName = `${userId}/${sanitizeFileName(
        `ehliyet_on_${Date.now()}_${file.name}`
      )}`;

      const { data, error } = await supabase.storage
        .from("driver-documents")
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        setError(error.message);
        return;
      }

      setLicenseFront({ path: data.path, name: file.name });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ehliyet ön yüz yüklenemedi.");
    } finally {
      setUploading2(null);
    }
  };

  const handleUploadLicenseBack = async (file: File) => {
    setError(null);
    setUploading2("back");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/sofor");
        return;
      }

      const userId = session.user.id;
      const fileName = `${userId}/${sanitizeFileName(
        `ehliyet_arka_${Date.now()}_${file.name}`
      )}`;

      const { data, error } = await supabase.storage
        .from("driver-documents")
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        setError(error.message);
        return;
      }

      setLicenseBack({ path: data.path, name: file.name });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ehliyet arka yüz yüklenemedi.");
    } finally {
      setUploading2(null);
    }
  };

  const handleUploadIdFront = async (file: File) => {
    setError(null);
    setUploading3(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/sofor");
        return;
      }

      const userId = session.user.id;
      const fileName = `${userId}/${sanitizeFileName(
        `kimlik_on_${Date.now()}_${file.name}`
      )}`;

      const { data, error } = await supabase.storage
        .from("driver-documents")
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        setError(error.message);
        return;
      }

      setIdFront({ path: data.path, name: file.name });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Kimlik ön yüz yüklenemedi.");
    } finally {
      setUploading3(false);
    }
  };

  const handleSubmit = async () => {
    if (!canStep4 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();

      // 1) users.role = 'sofor'
      const { error: userUpErr } = await supabase.from("users").upsert(
        {
          id: user.id,
          role: "sofor",
          full_name: fullName.trim(),
        },
        { onConflict: "id" }
      );
      if (userUpErr) throw userUpErr;

      // 2) driver_profiles upsert + is_approved=false
      const { error: profErr } = await supabase.from("driver_profiles").upsert(
        {
          user_id: user.id,
          is_online: false,
          is_approved: false,
          full_name: fullName.trim(),
          birth_date: birthDate,
          city,
          license_no: licenseNo.trim(),
          license_class: licenseClass,
          license_expiry: licenseExpiry,
          license_front_url: licenseFront?.path ?? null,
          license_back_url: licenseBack?.path ?? null,
          tc_no: tcNo.replace(/\D/g, ""),
          id_front_url: idFront?.path ?? null,
          iban: iban.trim().toUpperCase(),
          account_name: accountName.trim(),
        },
        { onConflict: "user_id" }
      );
      if (profErr) throw profErr;

      router.replace("/sofor/kayit/tamamlandi");
    } catch (err) {
      console.error(err);
      setError(
        "Başvuru kaydedilemedi. driver_profiles kolonlarını eklediğinden ve Storage bucket oluşturduğundan emin ol."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => (step === 1 ? router.back() : back())}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>

        {header}

        <div className="mt-6 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Ad Soyad
                </p>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Doğum tarihi
                </p>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Şehir
                </p>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                >
                  <option value="">Seçiniz</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={!canStep1}
                onClick={next}
                className="mt-2 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
              >
                İleri
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Ehliyet no
                </p>
                <input
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  placeholder="Örn: 1234567890"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Sınıf
                  </p>
                  <select
                    value={licenseClass}
                    onChange={(e) => setLicenseClass(e.target.value as any)}
                    className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  >
                    <option value="">Seç</option>
                    <option value="B">B</option>
                    <option value="B1">B1</option>
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Geçerlilik
                  </p>
                  <input
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="block">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Ehliyet ön yüz
                  </p>
                  <div className="mt-2 rounded-[16px] border-2 border-dashed border-[var(--border)] bg-transparent p-4">
                    {!licenseFront ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-[var(--text-dim)]">
                          <span className="mr-2">📄</span> Fotoğraf yükle
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading2 === "front"}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleUploadLicenseFront(f);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                        <span className="text-[var(--green)]">✓</span>
                        <span className="flex-1 truncate text-[var(--text)]">
                          {licenseFront.name}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-bold text-[var(--text-muted)]"
                          onClick={() => setLicenseFront(null)}
                        >
                          Değiştir
                        </button>
                      </div>
                    )}
                    {uploading2 === "front" && (
                      <p className="mt-2 text-xs text-[var(--text-dim)]">
                        Yükleniyor...
                      </p>
                    )}
                  </div>
                </label>

                <label className="block">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Ehliyet arka yüz
                  </p>
                  <div className="mt-2 rounded-[16px] border-2 border-dashed border-[var(--border)] bg-transparent p-4">
                    {!licenseBack ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-[var(--text-dim)]">
                          <span className="mr-2">📄</span> Fotoğraf yükle
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading2 === "back"}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleUploadLicenseBack(f);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                        <span className="text-[var(--green)]">✓</span>
                        <span className="flex-1 truncate text-[var(--text)]">
                          {licenseBack.name}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-bold text-[var(--text-muted)]"
                          onClick={() => setLicenseBack(null)}
                        >
                          Değiştir
                        </button>
                      </div>
                    )}
                    {uploading2 === "back" && (
                      <p className="mt-2 text-xs text-[var(--text-dim)]">
                        Yükleniyor...
                      </p>
                    )}
                  </div>
                </label>
              </div>

              <button
                type="button"
                disabled={!canStep2}
                onClick={next}
                className="mt-2 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
              >
                İleri
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  TC Kimlik No
                </p>
                <input
                  inputMode="numeric"
                  value={tcNo}
                  onChange={(e) => setTcNo(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  placeholder="11 hane"
                />
              </div>

              <label className="block">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Kimlik ön yüz
                </p>
                <div className="mt-2 rounded-[16px] border-2 border-dashed border-[var(--border)] bg-transparent p-4">
                  {!idFront ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[var(--text-dim)]">
                        <span className="mr-2">📄</span> Fotoğraf yükle
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading3}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void handleUploadIdFront(f);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                      <span className="text-[var(--green)]">✓</span>
                      <span className="flex-1 truncate text-[var(--text)]">
                        {idFront.name}
                      </span>
                      <button
                        type="button"
                        className="text-xs font-bold text-[var(--text-muted)]"
                        onClick={() => setIdFront(null)}
                      >
                        Değiştir
                      </button>
                    </div>
                  )}
                  {uploading3 && (
                    <p className="mt-2 text-xs text-[var(--text-dim)]">
                      Yükleniyor...
                    </p>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <input
                  type="checkbox"
                  checked={noCriminalRecord}
                  onChange={(e) => setNoCriminalRecord(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-bold text-[var(--text)]">
                    Adli sicil kaydım yok
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-dim)]">
                    Başvuruyu tamamlamak için onaylaman gerekir.
                  </p>
                </div>
              </label>

              <button
                type="button"
                disabled={!canStep3}
                onClick={next}
                className="mt-2 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
              >
                İleri
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  IBAN
                </p>
                <input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  placeholder="TR..."
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Hesap sahibi adı
                </p>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <button
                type="button"
                disabled={!canStep4 || loading}
                onClick={handleSubmit}
                className="mt-2 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Başvuruyu Tamamla"}
              </button>
            </div>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <p className="mt-6 text-center text-sm text-[var(--text-dim)]">
          Zaten hesabın var mı?{" "}
          <button
            type="button"
            className="text-[14px] font-medium text-[var(--text-muted)] hover:underline"
            onClick={() => router.push("/sofor")}
          >
            Giriş Yap
          </button>
        </p>
      </main>
    </div>
  );
}

