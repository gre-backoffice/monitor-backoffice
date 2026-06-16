# Boas Práticas — Monitor de Chamados

Orientações para uso consistente e eficiente do sistema. Seguir essas práticas garante dados confiáveis, indicadores precisos e um histórico útil para toda a equipe.

---

## Registro do chamado

### Registre no calor do plantão
O registro deve ser feito **durante ou imediatamente após o acionamento**, não ao final do plantão. Datas e horários preenchidos retroativamente comprometem os cálculos de MTTR e tempo de resposta.

### Seja preciso no campo Solicitante
Informe o nome real da pessoa ou o nome do sistema que gerou o alerta — não use termos genéricos como "usuário" ou "cliente". Isso facilita o rastreamento e o contato posterior.

### Selecione todos os sistemas afetados
Se o chamado envolve mais de uma plataforma (ex: OCC + Adyen), selecione ambas. Os indicadores de "top ofensores" e volume por sistema só são precisos se o registro for completo.

### Use a severidade com critério
A severidade define a urgência de resposta e influencia o MTTR por nível. Não use **Crítica** por padrão — reserve para situações de impacto total em operação. Superestimar a severidade distorce os indicadores.

### Preencha a descrição mesmo que breve
Uma linha já é suficiente: descreva o sintoma visível e o impacto percebido. Isso permite que outro analista entenda o contexto sem precisar perguntar.

---

## Gestão do status

### Inicie o atendimento assim que começar a trabalhar no chamado
Ao começar a investigar, clique em **"▶ Iniciar atendimento agora"** ou mude o status para **Em andamento**. O tempo de resposta (entre o acionamento e o início do atendimento) é um KPI importante — atrasar esse registro distorce os dados.

### Use Pausar quando interromper o atendimento temporariamente
Se você precisou aguardar retorno de um parceiro, acionar outro setor ou foi chamado para outro chamado mais urgente, use **Pausar** ao voltar para Aberto. O tempo acumulado fica preservado e o histórico de atendimento reflete a realidade.

### Use Zerar apenas quando necessário
**Zerar** descarta o tempo de atendimento já registrado. Use apenas se o chamado foi registrado com dados incorretos e precisa ser reaberto como novo ciclo.

### Não deixe chamados em "Em andamento" indefinidamente
Se o problema foi resolvido ou encerrado (mesmo que sem solução definitiva), atualize o status. Chamados presos em andamento inflam os alertas de overdue e prejudicam a visibilidade da equipe.

### Confirme "Resolvido de fato" com responsabilidade
Marque esse campo apenas quando o problema foi efetivamente resolvido na causa raiz. Evite marcar apenas para "fechar" o chamado — isso contamina o MTTR e reduz a confiabilidade dos indicadores.

---

## Parceiro externo e Jira

### Sempre registre o parceiro quando houver acionamento externo
Se você acionou Prático, Maker ou qualquer fornecedor, registre no campo "Parceiro externo". Esse dado é essencial para gestão de contratos e SLAs.

### Registre no Jira quando o sistema alertar
Se o chamado ficou mais de 2 horas em andamento com atuação de parceiro externo, o sistema exibirá um aviso ao concluir. Esse registro no Jira é **obrigatório** para o apontamento de horas contratadas — não ignore o aviso.

---

## Gestão das listas (sistemas, grupos, parceiros, setores)

### Antes de adicionar, verifique se já existe
O sistema aceita cadastro de novos sistemas, grupos e parceiros, mas não há detecção automática de duplicatas com escrita diferente (ex: "E-millenium" vs "E-Millenium"). Verifique a lista antes de adicionar.

### Padronize os nomes ao adicionar
Use o nome oficial da plataforma ou parceiro. Evite abreviações não padronizadas. Exemplos corretos: `Oracle Responsys`, `Seta Digital`, `AnyMarket`.

### Remova sistemas da lista se eles caírem em desuso
A lista de sistemas exibida na tela de Registrar deve ser enxuta e atual. Sistemas que não são mais usados devem ser removidos para não poluir o formulário dos colegas.

---

## Comentários e observações

### Use os comentários para registrar o histórico de ações
Anote na caixa de **Comentários / Observações** tudo que foi feito para diagnóstico e resolução: comandos executados, tickets abertos com fornecedores, decisões tomadas, follow-ups pendentes. Isso é especialmente valioso em chamados de longa duração ou que envolvem mais de um turno.

### Não use abreviações que só você entende
Os comentários devem ser compreensíveis por qualquer membro da equipe, inclusive quem for assumir o chamado ou revisar o histórico depois.

---

## Indicadores e exportação

### Consulte os indicadores periodicamente, não só em crise
O dashboard é mais útil quando consultado com regularidade — semanal ou mensalmente — para identificar tendências, sistemas problemáticos recorrentes e horários de pico antes que virem incidentes maiores.

### Use o filtro por responsável para acompanhar a distribuição do time
O filtro de responsável na aba Acompanhar permite ver quais chamados cada analista está gerenciando. Use para equilibrar a carga em plantões com múltiplos analistas.

### Exporte antes de limpar
Se for necessário limpar os dados (botão "Limpar"), sempre exporte o CSV ou JSON antes. Essa exportação serve como backup e histórico do período.

### Use o filtro de indicadores para análises específicas
Clique nas barras dos gráficos de Grupo, Sistema ou Setor para filtrar todos os KPIs por aquela dimensão. Isso permite análises como "qual é o MTTR dos chamados de OCC?" ou "quantos chamados críticos vieram do Plantão B2C?".

---

## Trabalho em equipe

### Não altere chamados de outros analistas sem comunicar
O sistema permite que qualquer usuário logado edite qualquer chamado. Se precisar atualizar o chamado de um colega (ex: ao assumir um chamado), comunique pelo canal do Teams antes ou depois.

### Use o campo Responsável para deixar claro quem está atuando
Em plantões com múltiplos analistas, preencha sempre o campo Responsável para evitar duplicação de esforço ou chamados sem dono.

### Alinhe com a equipe antes de remover sistemas ou grupos da lista
A remoção de um sistema da lista afeta a visualização de todos os usuários. Combine antes de remover itens compartilhados.

---

## Segurança e acesso

### Não compartilhe suas credenciais de acesso
Cada analista deve ter seu próprio usuário. Em caso de necessidade de novo acesso, solicite ao responsável pelo projeto no Supabase.

### Encerre a sessão ao terminar o plantão
Clique em **"sair"** no canto superior direito para encerrar a sessão, especialmente se estiver em um computador compartilhado.

### `demoMode: true` é apenas para desenvolvimento
O modo demo não sincroniza dados com o banco. Nunca use em produção durante um plantão real — os chamados registrados serão perdidos ao fechar o navegador.
