# Monitor de Chamados — Backoffice Tech · Grendene

Ferramenta interna de registro e acompanhamento de chamados de plantão da equipe de TI B2C/B2E da Grendene. Permite registrar ocorrências em tempo real, acompanhar o ciclo de vida de cada chamado e visualizar indicadores operacionais do time.

---

## Visão geral

| | |
|---|---|
| **Público** | Equipe de TI Backoffice — analistas de plantão e coordenação |
| **Ambiente** | Navegador (sem instalação) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Sincronização** | Tempo real — dados espelhados em todos os dispositivos logados |

---

## Stack técnica

- **Frontend:** HTML5 + JavaScript (runtime React 18 embutido via Claude Design)
- **Banco de dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth (e-mail + senha)
- **Cache local:** `localStorage` com write-through para o Supabase
- **Bibliotecas vendor (offline):** `react`, `react-dom`, `@supabase/supabase-js` — todas em `/vendor`

---

## Estrutura do projeto

```
monitor-backoffice/
├── index.html               # Aplicação completa (template + lógica)
├── config.js                # Configuração Supabase e modo demo
├── sb-bridge.js             # Autenticação + sincronização Supabase ↔ localStorage
├── support.js               # Runtime gerado (não editar diretamente)
├── schema.sql               # Schema do banco de dados Supabase
├── assets/
│   └── GRND3.SA_BIG.png    # Logo Grendene (PNG com transparência)
├── vendor/
│   ├── react.production.min.js
│   ├── react-dom.production.min.js
│   └── supabase.js
└── docs/
    ├── REGRAS-DE-NEGOCIO.md
    ├── MANUAL-DO-USUARIO.md
    └── BOAS-PRATICAS.md
```

---

## Configuração

### Produção (com Supabase)

Confirme que `demoMode` está `false` em `config.js`:

```js
const SUPABASE_CONFIG = {
  url:     "https://<projeto>.supabase.co",
  anonKey: "<anon-key>",
  demoMode: false   // produção
};
```

Acesse `index.html` no navegador, faça login com as credenciais cadastradas no Supabase e os dados sincronizam automaticamente.

### Desenvolvimento offline (modo demo)

Mude `demoMode` para `true`. O app abre sem login e usa dados locais — nada é enviado ao banco.

```js
demoMode: true   // desenvolvimento local
```

> Sempre retornar para `false` antes de fazer commit para produção.

### Setup inicial do banco

Execute o arquivo `schema.sql` no SQL Editor do Supabase para criar as tabelas `chamados` e `app_lists`.

---

## Executar localmente

Por ser HTML estático, basta abrir `index.html` no navegador. Para evitar restrições de CORS ao carregar assets locais, use uma extensão de live-server (ex: *Live Server* no VS Code) ou:

```bash
npx serve .
```

---

## Deploy

Não há build step. Alterações em `index.html`, `sb-bridge.js` ou `config.js` entram em produção após `git push` — o arquivo é servido diretamente pelo host.

---

## Documentação complementar

- [Regras de Negócio](docs/REGRAS-DE-NEGOCIO.md)
- [Manual do Usuário](docs/MANUAL-DO-USUARIO.md)
- [Boas Práticas](docs/BOAS-PRATICAS.md)
