-- ============================================================
-- FAINL: user_tokens tabel
-- Bijhoudt gekochte en gebruikte tokens per gebruiker (email)
-- Elke Stripe checkout session = één rij (idempotent via stripe_session_id)
-- ============================================================

create table if not exists public.user_tokens (
  id                 uuid        primary key default gen_random_uuid(),
  email              text        not null,
  tokens_purchased   integer     not null default 0,
  tokens_used        integer     not null default 0,
  stripe_session_id  text        unique not null,
  amount_paid        integer,                          -- in centen
  created_at         timestamptz default now()
);

-- Snelle lookup op email
create index if not exists idx_user_tokens_email
  on public.user_tokens(email);

-- RLS inschakelen
alter table public.user_tokens enable row level security;

-- Gebruikers mogen alleen hun eigen rijen lezen
create policy "Users can view own tokens"
  on public.user_tokens
  for select
  using (email = auth.email());

-- Gebruikers mogen tokens_used updaten op hun eigen rijen
create policy "Users can update own tokens_used"
  on public.user_tokens
  for update
  using (email = auth.email())
  with check (email = auth.email());

-- Service role (webhook) mag alles (wordt via service key aangeroepen, omzeilt RLS)
-- Geen extra policy nodig: service_role bypasses RLS automatisch
