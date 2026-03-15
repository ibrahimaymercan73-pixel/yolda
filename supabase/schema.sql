-- YOLDA Müşteri Paneli - Supabase şeması
-- Bu dosyayı Supabase SQL Editor'de çalıştırın.

-- OTP kodları (telefon doğrulama, Netgsm)
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Uygulama kullanıcıları (telefon veya e-posta ile)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  email text,
  name text NOT NULL DEFAULT '',
  auth_uid uuid, -- Supabase auth.users.id (e-posta girişi için)
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(phone),
  UNIQUE(email)
);

-- Araçlar
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand text NOT NULL,
  model text NOT NULL,
  color text NOT NULL,
  plate text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Talepler (şoför + çekici tek tablo)
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  service_type text NOT NULL CHECK (service_type IN ('sofor', 'cekici')),
  from_location jsonb NOT NULL DEFAULT '{}',
  to_location jsonb NOT NULL DEFAULT '{}',
  scheduled_time timestamptz,
  vehicle_details jsonb, -- çekici için: type, problem, gear, drive, extra_note
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'accepted', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teklifler (şoför/çekici teklifleri)
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL, -- şoför veya çekici user_id
  price decimal(10,2) NOT NULL,
  estimated_minutes int,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- İşler (ödeme ve durum takibi)
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'released')),
  paytr_merchant_oid text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: Müşteri paneli API route'lar (service_role) ve client (anon) kullanır.
-- Hassas işlemler API üzerinden yapılır; Realtime için offers/requests okunabilir.
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "otp_codes_service" ON otp_codes FOR ALL USING (true);

CREATE POLICY "users_all" ON users FOR ALL USING (true);
CREATE POLICY "vehicles_all" ON vehicles FOR ALL USING (true);
CREATE POLICY "requests_all" ON requests FOR ALL USING (true);
CREATE POLICY "offers_all" ON offers FOR ALL USING (true);
CREATE POLICY "jobs_all" ON jobs FOR ALL USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone_used ON otp_codes(phone, used);
CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_request ON offers(request_id);
CREATE INDEX IF NOT EXISTS idx_jobs_request ON jobs(request_id);
