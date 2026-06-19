-- ============================================================
-- Torre de Plantão — Schema Supabase
-- Rode no SQL Editor do Supabase (uma vez).
-- ============================================================

-- Chamados (id é gerado no app, então é text)
create table if not exists public.chamados (
  id                 text primary key,
  solicitante        text,
  grupo              text,
  sistema            text,
  sistemas           jsonb,          -- multi-seleção de sistemas
  forma_acionamento  text,           -- 'grupo' | 'privado'
  setor_solicitante  text,
  descricao          text,
  severidade         text,
  acionamento        text,           -- data/hora informada (texto, igual ao app)
  responsavel        text,
  status             text,           -- 'aberto' | 'andamento' | 'pausado' | 'resolvido'
  inicio_atendimento text,           -- data/hora em que o atendimento foi iniciado
  tempo_acumulado    bigint,         -- ms de trabalho ativo acumulado (exclui pausas)
  paused_at          text,           -- data/hora do início da pausa atual (null se não pausado)
  total_paused_ms    bigint,         -- ms totais gastos em pausas
  resolved_at        text,
  resolved_de_fato   boolean default false,
  parceiro_externo   boolean default false,
  parceiro_qual      text,
  outro_setor        boolean default false,
  setor_qual         text,
  comentarios        text,
  created_at         text            -- ISO de criação (texto, igual ao app)
);

create index if not exists idx_chamados_grupo   on public.chamados (grupo);
create index if not exists idx_chamados_sistema on public.chamados (sistema);
create index if not exists idx_chamados_status  on public.chamados (status);

-- Listas customizáveis (grupos, parceiros, setores, sistemas, sistemas ocultos)
create table if not exists public.app_lists (
  name   text primary key,           -- ex: grendene_grupos_v1
  items  jsonb not null default '[]'
);

-- ============================================================
-- RLS — acesso só para usuários autenticados (Supabase Auth)
-- ============================================================
alter table public.chamados  enable row level security;
alter table public.app_lists enable row level security;

drop policy if exists "auth_all_chamados" on public.chamados;
create policy "auth_all_chamados"
  on public.chamados for all
  to authenticated using (true) with check (true);

drop policy if exists "auth_all_lists" on public.app_lists;
create policy "auth_all_lists"
  on public.app_lists for all
  to authenticated using (true) with check (true);
