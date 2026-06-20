# Regras de Negócio — Monitor de Chamados

Este documento descreve as regras que governam o comportamento do sistema de registro de chamados da equipe de TI Backoffice da Grendene.

---

## 1. Campos obrigatórios no registro

Um chamado só pode ser registrado se os seguintes campos estiverem preenchidos:

| Campo | Obrigatoriedade |
|---|---|
| Solicitante | Obrigatório |
| Sistema / Plataforma | Obrigatório (um ou mais) |
| Grupo do Teams | Obrigatório apenas quando a forma de acionamento for **Grupo do Teams** |
| Forma de acionamento | Obrigatório |

Campos opcionais: Setor/Área, Descrição, Responsável, Data/hora do acionamento (auto-preenchida com o horário atual se não informada).

---

## 2. Formas de acionamento

| Forma | Descrição |
|---|---|
| **Grupo do Teams** | O chamado foi reportado em um canal/grupo público do Microsoft Teams |
| **Privado** | O chamado foi reportado diretamente por mensagem privada, fora dos grupos |

Quando a forma for **Privado**, o campo "Grupo do Teams" não aparece e não é exigido.

---

## 3. Severidades

| Nível | Cor | Critério de uso |
|---|---|---|
| **Crítica** | Vermelho | Impacto total em operação — sistema fora do ar ou bloqueando vendas/operações em massa |
| **Alta** | Laranja | Impacto significativo — funcionalidade crítica degradada, afeta múltiplos usuários |
| **Média** | Amarelo | Impacto parcial — funcionalidade afetada mas com contorno operacional |
| **Baixa** | Azul | Impacto mínimo — instabilidade pontual, afeta poucos usuários ou é intermitente |

---

## 4. Ciclo de vida do chamado (status)

```
Aberto  ──►  Em andamento  ──►  Resolvido
  ▲                │
  └────────────────┘  (retorno com diálogo de pausa)
```

### 4.1 Aberto
- Estado inicial de todo chamado registrado.
- O cronômetro de "tempo em aberto" começa a contar a partir do campo **Data/hora do acionamento**.

### 4.2 Em andamento
- Ao mover um chamado para **Em andamento**, o sistema registra automaticamente o horário de início do atendimento (`inicioAtendimento`).
- Esse registro é feito uma única vez por sessão de atendimento; retomadas posteriores acumulam o tempo.
- O **tempo de resposta** (tempo em aberto) = `inicioAtendimento − acionamento`.

### 4.3 Retorno para Aberto (regra de pausa)
Ao mover um chamado de **Em andamento** de volta para **Aberto**, o sistema exibe um diálogo obrigatório com duas opções:

| Opção | Efeito |
|---|---|
| **Pausar — manter tempo acumulado** | O tempo já trabalhado é salvo. Ao retomar "Em andamento", o cronômetro continua de onde parou. |
| **Zerar — reiniciar do zero** | O período anterior é descartado. O cronômetro começa do zero na próxima retomada. |

> Use **Pausar** quando o problema foi temporariamente interrompido mas ainda está em investigação. Use **Zerar** quando o chamado foi encerrado prematuramente e precisa ser reaberto como novo ciclo.

### 4.4 Resolvido
- Ao marcar como **Resolvido**, o sistema registra automaticamente o horário de resolução (`resolvedAt`).
- O analista deve clicar em **Salvar alterações** e confirmar a resolução no diálogo de confirmação.
- O **tempo de atendimento ativo** (trabalho real, excluindo pausas) fica congelado no campo `tempoAcumulado` no momento da conclusão.
- O **tempo total do chamado** (acionamento → resolução) usa `resolvedAt − acionamento` para ordenação e gráficos.

#### Correção retroativa do horário de resolução

O campo **Resolvido em** é editável diretamente no card expandido do chamado (campo `datetime-local`). Isso permite corrigir o horário registrado de chamados anteriores.

**Impacto nos indicadores ao editar `resolvedAt`:**

| Indicador | Comportamento |
|---|---|
| **Tempo de atendimento ativo / MTTR** | **Não é afetado** quando `tempoAcumulado > 0` (caso padrão) — o tempo real de trabalho fica preservado |
| **Tempo total do chamado (`tempoMs`)** | Recalculado com o novo `resolvedAt − acionamento` |
| **% tempo em backlog** | Recalculado com o novo `resolvedAt` |
| **MTTR de chamados sem `tempoAcumulado`** | Recalculado via `resolvedAt − inicioAtendimento` — aplicável a registros históricos sem sessões de trabalho contabilizadas |

---

## 5. Confirmação "Resolvido de fato"

O campo **Resolvido de fato** (checkbox ✓) indica que o problema foi efetivamente corrigido na causa raiz — não apenas contornado ou que o usuário desistiu do chamado.

- Somente chamados com **Resolvido de fato** marcado entram no cálculo do MTTR nos indicadores.
- O analista deve confirmar esse campo conscientemente antes de salvar.

---

## 6. Alertas de tempo (indicadores visuais na listagem)

| Condição | Sinalização |
|---|---|
| Chamado em **Aberto** há mais de **4 horas** sem iniciar atendimento | Borda lateral amarela + aviso "⏳ +Xh sem início" |
| Chamado em **andamento** há mais de **4 horas** acumuladas | Borda lateral laranja + aviso "⚠ +Xh em atend." |

---

## 7. Parceiro externo

Quando a resolução do chamado exigiu acionamento de um fornecedor ou parceiro externo:

1. Marcar **"Sim"** no campo "Precisou de parceiro externo?".
2. Selecionar qual parceiro (Prático, Maker, ou adicionar novo).

**Regra de apontamento no Jira:**
Se o chamado ficou **mais de 2 horas em andamento** (tempo acumulado) e teve atuação de parceiro externo, o sistema exibe um aviso ao concluir:
> ⚠ Registre no Jira para apontamento de horas trabalhadas do parceiro.

Esse registro é **obrigatório** para fins de controle de SLA contratual com o parceiro.

---

## 8. Outro setor Grendene

Quando a resolução exigiu apoio de outro setor interno da Grendene (ex: Desenvolvimento, Fiscal, Financeiro):

1. Marcar **"Sim"** no campo "Precisou de outro setor Grendene?".
2. Selecionar qual setor.

Essa informação alimenta os indicadores de dependência entre áreas.

---

## 9. Grupos do Teams

Grupos padrão cadastrados:

- Plantão B2C
- Marketplace
- Suporte Loja
- Operação OMNI

Novos grupos podem ser adicionados diretamente na tela de registro clicando em **"+ novo grupo"**. O novo grupo fica disponível para todos os colaboradores após a sincronização.

---

## 10. Sistemas / Plataformas

Sistemas padrão cadastrados:

`OCC` · `ConecteMe` · `Intelipost` · `Adyen` · `ClearSale` · `E-Millenium` · `Seta Digital` · `Oracle Responsys` · `Pliq` · `AnyMarket` · `Outro`

- Um chamado pode ter **múltiplos sistemas** selecionados.
- Novos sistemas podem ser adicionados via **"＋ Novo sistema"** e editados ou removidos da lista a qualquer momento.
- A remoção de um sistema da lista **não afeta chamados já registrados**.

---

## 11. Exportação de dados

| Formato | Conteúdo |
|---|---|
| **CSV** | Todos os chamados com todos os campos em formato tabular — indicado para análise no Excel |
| **JSON** | Dump completo em formato estruturado — indicado para integrações ou backup |

A exportação sempre reflete o estado atual dos dados carregados na sessão.

---

## 12. Indicadores (dashboard)

Os indicadores são calculados sobre o conjunto completo de chamados. É possível filtrar por grupo, sistema ou setor clicando nas barras dos gráficos.

| Indicador | Definição |
|---|---|
| **Total de chamados** | Contagem total no período visível |
| **% Resolvidos** | Chamados com status Resolvido / total |
| **% com Parceiro externo** | Chamados que acionaram fornecedor / total |
| **% com outro setor** | Chamados com apoio interno / total |
| **MTTR geral** | Tempo médio entre acionamento e resolução (apenas chamados resolvidos) |
| **MTTR por severidade** | MTTR segmentado por Crítica / Alta / Média / Baixa |
| **Volume por data** | Linha temporal de acionamentos por dia |
| **Volume por grupo** | Contagem por canal do Teams |
| **Volume por sistema** | Contagem por plataforma |
| **Volume por setor solicitante** | Contagem por área requisitante |
| **Acionamentos por hora** | Distribuição das 24h do dia — identifica picos de demanda |
| **Top ofensores** | Os 5 sistemas com maior volume de chamados |
