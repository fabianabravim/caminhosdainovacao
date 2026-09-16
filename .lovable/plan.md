# Reorganização da Jornada da Inovação Capixaba

## Objetivo
Reorganizar exclusivamente `/jornada` em cinco áreas claras, mantendo a Home e todas as regras, dados, mapas, identidade e progresso automático existentes.

## O que será alterado
- Manter uma única navegação da Jornada com: **Visão Geral, Atividades, Missões, Relatórios e Meu Núcleo**, adaptada ao mobile sem comprimir textos nem gerar rolagem horizontal.
- Tornar a **Visão Geral** um painel compacto com saudação, ações imediatas, resumo de desempenho, resumo do Núcleo, progresso dos quatro pilares e até três próximas missões.
- Evoluir **Atividades** para histórico responsivo com filtros de status e todas as colunas solicitadas, preservando o formulário unificado e o feedback pós-envio já existentes.
- Manter as 12 missões agrupadas pelos quatro caminhos em **Missões**, com progresso automático e CTAs abrindo o mesmo formulário com tipo e missão preenchidos.
- Evoluir **Relatórios** para uma listagem própria com competência/período, envio, status e análise, usando o fluxo unificado de envio já existente.
- Ampliar **Meu Núcleo** com mapa, dupla de Conectores, progresso coletivo, metas, missões, indicadores, atividades recentes e ranking secundário marcado como demonstrativo.
- Corrigir, somente na área autenticada, referências a “Rede Capixaba” para a terminologia institucional indicada.

## Preservações obrigatórias
- Não alterar Home, mapas compartilhados, identidade visual, paleta, tipografia ou nomes dos 14 Núcleos.
- Manter `MeuNucleoProvider` único envolvendo toda a Jornada e preservar as regras atuais de validação e progresso automático.
- Não inventar novos dados reais nem criar competição entre os dois Conectores.

## Detalhes técnicos
- Reutilizar os componentes e dados atuais da Jornada, criando apenas componentes auxiliares focados quando necessário.
- Navegação entre áreas será local à página, sem criar rotas paralelas ou duplicar providers.
- Os números demonstrativos solicitados para “Meu desempenho” serão identificados visualmente como demonstrativos; dados territoriais cadastráveis continuarão derivados do contexto atual.
- Validar os fluxos principais e a ausência de cortes/rolagem horizontal em 360, 390, 430, 768, 1024 e 1440 px.
