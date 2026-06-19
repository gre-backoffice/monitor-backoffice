// ============================================================
// Torre de Plantão — bridge Supabase
// Mantém o app do Claude Design INTACTO: ele continua lendo/gravando
// no localStorage; este bridge espelha esses dados no Supabase.
// Ordem de boot: autenticar -> hidratar localStorage do Supabase ->
// carregar o runtime (support.js) -> app monta com os dados certos.
// ============================================================
(function () {
  "use strict";

  const CH_KEY = "grendene_chamados_v1";
  const LIST_KEYS = [
    "grendene_grupos_v1",
    "grendene_parceiros_v1",
    "grendene_setores_v1",
    "grendene_sistemas_v1",
    "grendene_hidden_sistemas_v1"
  ];

  let sb;
  let knownIds = new Set();
  let runtimeLoaded = false;
  const _setItem = localStorage.setItem.bind(localStorage);

  // ---------- mapeamento ticket <-> linha ----------
  function toRow(t) {
    return {
      id: String(t.id),
      solicitante: t.solicitante ?? null,
      grupo: t.grupo ?? null,
      sistema: t.sistema ?? null,
      sistemas: t.sistemas ?? [],
      forma_acionamento: t.formaAcionamento ?? null,
      setor_solicitante: t.setorSolicitante ?? null,
      descricao: t.descricao ?? null,
      severidade: t.severidade ?? null,
      acionamento: t.acionamento ?? null,
      responsavel: t.responsavel ?? null,
      status: t.status ?? null,
      inicio_atendimento: t.inicioAtendimento ?? null,
      tempo_acumulado: t.tempoAcumulado ?? null,
      paused_at: t.pausedAt ?? null,
      total_paused_ms: t.totalPausedMs ?? null,
      resolved_at: t.resolvedAt ?? null,
      resolved_de_fato: !!t.resolvedDeFato,
      parceiro_externo: !!t.parceiroExterno,
      parceiro_qual: t.parceiroQual ?? null,
      outro_setor: !!t.outroSetor,
      setor_qual: t.setorQual ?? null,
      comentarios: t.comentarios ?? null,
      created_at: t.createdAt ?? null
    };
  }
  function fromRow(r) {
    return {
      id: r.id,
      solicitante: r.solicitante || "",
      grupo: r.grupo || "",
      sistema: r.sistema || "",
      sistemas: r.sistemas || [],
      formaAcionamento: r.forma_acionamento || "grupo",
      setorSolicitante: r.setor_solicitante || "",
      descricao: r.descricao || "",
      severidade: r.severidade || "Média",
      acionamento: r.acionamento || "",
      responsavel: r.responsavel || "",
      status: r.status || "aberto",
      inicioAtendimento: r.inicio_atendimento || null,
      tempoAcumulado: r.tempo_acumulado || null,
      pausedAt: r.paused_at || null,
      totalPausedMs: r.total_paused_ms || null,
      resolvedAt: r.resolved_at || null,
      resolvedDeFato: !!r.resolved_de_fato,
      parceiroExterno: !!r.parceiro_externo,
      parceiroQual: r.parceiro_qual || "",
      outroSetor: !!r.outro_setor,
      setorQual: r.setor_qual || "",
      comentarios: r.comentarios || "",
      createdAt: r.created_at || new Date().toISOString()
    };
  }

  // ---------- hidratação (Supabase -> localStorage) ----------
  async function hydrate() {
    const { data: chs, error: e1 } = await sb
      .from("chamados").select("*").order("created_at", { ascending: false });
    if (e1) throw e1;
    const tickets = (chs || []).map(fromRow);
    _setItem(CH_KEY, JSON.stringify(tickets));
    knownIds = new Set(tickets.map((t) => String(t.id)));

    const { data: lists, error: e2 } = await sb.from("app_lists").select("*");
    if (e2) throw e2;
    const map = {};
    (lists || []).forEach((r) => (map[r.name] = r.items || []));
    LIST_KEYS.forEach((k) => _setItem(k, JSON.stringify(map[k] || [])));
  }

  // ---------- write-through (localStorage -> Supabase) ----------
  let chTimer = null;
  localStorage.setItem = function (key, value) {
    _setItem(key, value);
    if (key === CH_KEY) {
      clearTimeout(chTimer);
      chTimer = setTimeout(() => syncChamados(value), 400);
    } else if (LIST_KEYS.indexOf(key) !== -1) {
      syncList(key, value);
    }
  };

  async function syncChamados(value) {
    let arr = [];
    try { arr = JSON.parse(value) || []; } catch (e) { return; }
    const curIds = new Set(arr.map((t) => String(t.id)));
    if (arr.length) {
      const { error } = await sb.from("chamados").upsert(arr.map(toRow));
      if (error) console.error("[sb] upsert chamados:", error.message);
    }
    const toDelete = [...knownIds].filter((id) => !curIds.has(id));
    if (toDelete.length) {
      const { error } = await sb.from("chamados").delete().in("id", toDelete);
      if (error) console.error("[sb] delete chamados:", error.message);
    }
    knownIds = curIds;
  }

  async function syncList(key, value) {
    let items = [];
    try { items = JSON.parse(value) || []; } catch (e) { return; }
    const { error } = await sb.from("app_lists").upsert({ name: key, items });
    if (error) console.error("[sb] upsert list:", error.message);
  }

  // ---------- runtime ----------
  function loadRuntime() {
    if (runtimeLoaded) return;
    runtimeLoaded = true;
    const s = document.createElement("script");
    s.src = "support.js";
    s.onload = () => setTimeout(removeLoader, 400);
    s.onerror = () => fail("Falha ao carregar o runtime (support.js).");
    document.head.appendChild(s);
  }
  function removeLoader() {
    const l = document.getElementById("sb-loader");
    if (l) l.remove();
  }

  // ---------- UI: loader, login, logout ----------
  function fail(msg) {
    const l = document.getElementById("sb-loader");
    if (l) l.innerHTML = '<div style="max-width:340px;text-align:center;color:#f85149">' + msg +
      '<br><br><span style="color:#8b949e;font-size:12px">Confira o config.js e o schema no Supabase.</span></div>';
  }

  function showLogin() {
    removeLoader();
    const ov = document.createElement("div");
    ov.id = "sb-login";
    ov.innerHTML =
      '<div class="sb-card">' +
      '<img src="assets/GRND3.SA_BIG.png" alt="Grendene" style="height:38px;display:block;margin:0 auto 18px;">' +
      '<div class="sb-dot"></div>' +
      '<h1>Monitor de Chamados</h1>' +
      '<p>TI B2C / B2E · Backoffice Tech</p>' +
      '<input id="sb-email" type="email" placeholder="e-mail" autocomplete="username" />' +
      '<input id="sb-pass" type="password" placeholder="senha" autocomplete="current-password" />' +
      '<button id="sb-enter">Entrar</button>' +
      '<div id="sb-err"></div>' +
      "</div>";
    document.body.appendChild(ov);
    const enter = document.getElementById("sb-enter");
    const doLogin = async () => {
      const email = document.getElementById("sb-email").value.trim();
      const password = document.getElementById("sb-pass").value;
      const err = document.getElementById("sb-err");
      err.textContent = "";
      enter.disabled = true; enter.textContent = "Entrando…";
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        err.textContent = "E-mail ou senha inválidos.";
        enter.disabled = false; enter.textContent = "Entrar";
        return;
      }
      ov.remove();
      proceed();
    };
    enter.addEventListener("click", doLogin);
    document.getElementById("sb-pass").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
    document.getElementById("sb-email").focus();
  }

  function mountLogout() {
    const b = document.createElement("button");
    b.id = "sb-logout";
    b.textContent = "sair";
    b.title = "Encerrar sessão";
    b.addEventListener("click", async () => { await sb.auth.signOut(); location.reload(); });
    document.body.appendChild(b);
  }

  // ---------- modo demo (offline) ----------
  function bootDemo() {
    const CH_KEY_LOCAL = "grendene_chamados_v1";
    if (!localStorage.getItem(CH_KEY_LOCAL)) {
      const agora = new Date().toISOString();
      const samples = [
        {
          id: "demo-1", solicitante: "Ana Souza", grupo: "TI B2C", sistema: "SAP",
          sistemas: ["SAP"], formaAcionamento: "grupo", setorSolicitante: "Operações",
          descricao: "Usuário sem acesso ao módulo de vendas após atualização.", severidade: "Alta",
          acionamento: agora, responsavel: "Gui", status: "aberto",
          resolvedAt: null, resolvedDeFato: false, parceiroExterno: false,
          parceiroQual: "", outroSetor: false, setorQual: "", comentarios: "", createdAt: agora
        },
        {
          id: "demo-2", solicitante: "Carlos Lima", grupo: "TI B2E", sistema: "Teams",
          sistemas: ["Teams"], formaAcionamento: "privado", setorSolicitante: "RH",
          descricao: "Não consegue entrar nas reuniões do Teams.", severidade: "Média",
          acionamento: agora, responsavel: "", status: "andamento",
          resolvedAt: null, resolvedDeFato: false, parceiroExterno: false,
          parceiroQual: "", outroSetor: false, setorQual: "", comentarios: "", createdAt: agora
        }
      ];
      localStorage.setItem(CH_KEY_LOCAL, JSON.stringify(samples));
    }

    const badge = document.createElement("div");
    badge.style.cssText = "position:fixed;top:10px;right:14px;z-index:5000;background:#d29922;color:#0d1117;border-radius:7px;padding:5px 12px;font-size:11.5px;font-weight:700;font-family:-apple-system,sans-serif;letter-spacing:0.04em;";
    badge.textContent = "MODO DEMO";
    document.body.appendChild(badge);

    loadRuntime();
  }

  // ---------- boot ----------
  async function proceed() {
    const loader = document.getElementById("sb-loader");
    if (loader) loader.textContent = "Sincronizando…";
    else {
      const l = document.createElement("div");
      l.id = "sb-loader"; l.textContent = "Sincronizando…";
      document.body.appendChild(l);
    }
    try {
      await hydrate();
    } catch (e) {
      console.error(e);
      fail("Não consegui conectar ao banco.");
      return;
    }
    mountLogout();
    loadRuntime();
  }

  async function boot() {
    if (typeof SUPABASE_CONFIG === "undefined" || /SEU-PROJETO/.test(SUPABASE_CONFIG.url)) {
      fail("Configure o config.js com a URL e a anon key do Supabase.");
      return;
    }
    if (SUPABASE_CONFIG.demoMode) {
      bootDemo();
      return;
    }
    sb = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    window.__sb = sb;
    const { data } = await sb.auth.getSession();
    if (data && data.session) proceed();
    else showLogin();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
