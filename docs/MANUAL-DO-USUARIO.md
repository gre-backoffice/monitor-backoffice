# Manual do Usuário — Monitor de Chamados

Este manual orienta os analistas de plantão e demais colaboradores no uso do Monitor de Chamados da equipe de TI Backoffice da Grendene.

---

## Acesso ao sistema

1. Abra o link do Monitor de Chamados no navegador.
2. Na tela de login, informe seu **e-mail** e **senha** cadastrados.
3. Clique em **Entrar**. Os dados da equipe serão carregados automaticamente.

> O sistema sincroniza em tempo real com o banco de dados. Qualquer chamado registrado por outro colega aparece na sua tela assim que você acessar ou atualizar a página.

---

## Navegação

O sistema possui três abas no topo:

| Aba | Função |
|---|---|
| **Registrar** | Abrir um novo chamado |
| **Acompanhar** | Ver e gerenciar todos os chamados ativos e históricos |
| **Indicadores** | Dashboard com métricas operacionais do time |

O número exibido ao lado de "Acompanhar" mostra quantos chamados estão **Abertos ou Em andamento** no momento.

---

## Tela 1 — Registrar chamado

Use esta tela assim que um chamado chegar, ainda durante o acionamento.

### Passo a passo

**1. Solicitante** *(obrigatório)*
Informe o nome de quem acionou o time — pode ser o nome da pessoa ou do sistema que gerou o alerta.

**2. Setor / Área**
Informe a área da empresa que fez o acionamento (ex: Operações, Marketing, Loja Centro).

**3. Forma de acionamento** *(obrigatório)*
- **Grupo do Teams** — chamado veio por um canal/grupo
- **Privado** — chamado veio por mensagem direta

**4. Grupo do Teams** *(obrigatório se a forma for "Grupo do Teams")*
Selecione o grupo de origem. Se for um grupo novo, clique em **"+ novo grupo"** para cadastrá-lo.

**5. Sistema / Plataforma** *(obrigatório)*
Selecione um ou mais sistemas envolvidos clicando nos botões de pill. Para cadastrar um sistema não listado, clique em **"＋ Novo sistema"**.

**6. Severidade**
Classifique o impacto:
- **Crítica** — operação parada / bloqueio total
- **Alta** — funcionalidade crítica comprometida
- **Média** — problema com contorno operacional
- **Baixa** — instabilidade pontual / afeta poucos usuários

**7. Descrição do problema**
Descreva brevemente o sintoma, impacto e qualquer informação relevante para o diagnóstico.

**8. Data/hora do acionamento**
Auto-preenchida com o horário atual. Ajuste caso o chamado tenha ocorrido antes e você está registrando com atraso. Clique em **"agora"** para redefinir para o horário atual.

**9. Responsável**
Informe quem vai atender o chamado.

**10. Registrar chamado**
Clique no botão para salvar. O chamado aparecerá imediatamente na aba **Acompanhar**.

---

## Tela 2 — Acompanhar chamados

Exibe todos os chamados em forma de tabela. Clique em qualquer linha para expandir e ver detalhes completos.

### Filtros disponíveis

| Filtro | Descrição |
|---|---|
| Busca livre | Pesquisa em todos os campos de texto |
| Origens | Filtra por grupo do Teams |
| Sistemas | Filtra por plataforma |
| Status | Aberto / Em andamento / Resolvido |
| Severidades | Crítica / Alta / Média / Baixa |
| Responsável | Filtra por analista responsável |

Clique em **"Limpar filtros"** para remover todos os filtros ativos.

### Ordenação por tempo

Clique no cabeçalho **"Tempo"** para ordenar os chamados do mais demorado para o mais recente, e vice-versa.

### Alertas visuais na listagem

| Sinalização | Significado |
|---|---|
| Borda amarela + "⏳ +Xh sem início" | Chamado aberto há mais de 4h sem atendimento iniciado |
| Borda laranja + "⚠ +Xh em atend." | Chamado em andamento há mais de 4h acumuladas |

### Gerenciando um chamado (painel expandido)

Ao clicar em um chamado, o painel expandido exibe:

#### Informações
- Origem, setor, data/hora do acionamento, início do atendimento, tempo de resposta, data de resolução, responsável, sistemas, descrição completa.

#### Status
Use os botões **Aberto / Em andamento / Resolvido** para avançar ou retroceder o status.

**Ao mover para Em andamento:**
O horário de início do atendimento é registrado automaticamente. Se já houve um atendimento anterior pausado, o tempo acumulado é preservado.

**Ao mover de Em andamento para Aberto:**
Um diálogo é exibido com duas opções:
- **⏸ Pausar** — mantém o tempo já trabalhado; ao retomar, o cronômetro continua de onde parou.
- **↺ Zerar** — descarta o período anterior; reinicia do zero na próxima retomada.

**Ao mover para Resolvido:**
O horário de resolução é registrado. Clique em **Salvar alterações** e confirme no diálogo de conclusão.

#### Botão "▶ Iniciar atendimento agora"
Aparece quando o chamado está Aberto e sem horário de início registrado. Registra o timestamp exato do início e muda o status para Em andamento.

#### Confirmação "Resolvido de fato"
Marque este campo apenas quando o problema foi **efetivamente corrigido na causa raiz**. Chamados marcados como "Resolvido de fato" entram no cálculo do MTTR nos indicadores.

#### Parceiro externo
Se a resolução exigiu apoio de fornecedor:
1. Marque **"Sim"** em "Precisou de parceiro externo?"
2. Selecione o parceiro na lista (ou adicione um novo)

> Se o chamado ficou mais de 2h em andamento com atuação de parceiro, o sistema alertará na conclusão para **registrar no Jira** o apontamento de horas.

#### Outro setor Grendene
Se foi necessário acionar outro setor interno, marque **"Sim"** e selecione qual setor.

#### Comentários / Observações
Use para anotar encaminhamentos, detalhes técnicos, follow-up ou qualquer informação relevante para o histórico.

#### Salvar alterações
Clique em **"Salvar alterações"** para confirmar todas as edições do chamado expandido. Se o status estiver como Resolvido, um diálogo de confirmação será exibido antes de fechar.

#### Excluir
Remove o chamado permanentemente. Use apenas em caso de registros duplicados ou incorretos.

---

## Tela 3 — Indicadores

Dashboard operacional com métricas do time. Os dados refletem todos os chamados registrados.

### KPIs principais
- **Total de chamados** — quantidade total + quantidade de abertos
- **% resolvidos** — taxa de resolução
- **% com parceiro externo** — frequência de acionamento de fornecedores
- **% com outro setor** — frequência de dependência interna

### MTTR (Tempo médio de resolução)
Exibe o tempo médio entre o acionamento e a resolução, tanto no geral quanto segmentado por severidade (Crítica, Alta, Média, Baixa).

### Gráficos interativos
- **Volume por grupo do Teams** — clique em uma barra para filtrar os indicadores por aquele grupo
- **Volume por sistema** — clique para filtrar por plataforma
- **Volume por setor / área** — clique para filtrar por área solicitante

Quando um filtro está ativo, aparece um banner azul no topo indicando o filtro aplicado. Clique em **"Limpar filtro"** para remover.

### Acionamentos por hora do dia
Histograma das 24 horas — identifica os horários de pico de demanda no plantão. A barra mais alta (laranja) é a hora com mais acionamentos.

### Top ofensores
Os 5 sistemas com maior volume de chamados no período.

---

## Exportar dados

No canto superior direito:

- **Exportar CSV** — abre planilha com todos os chamados (ideal para análise no Excel)
- **JSON** — exporta os dados em formato estruturado (ideal para integrações ou backup)

---

## Limpar dados

O botão **"Limpar"** remove **todos** os chamados da sessão. Uma confirmação é exigida. Use com cuidado — a operação não pode ser desfeita.

---

## Sair do sistema

Clique em **"sair"** no canto superior direito para encerrar a sessão.
