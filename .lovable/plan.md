# Reconstrução visual territorial — Caminhos da Inovação

## Objetivo
Reconstruir a apresentação e a experiência do projeto com uma linguagem institucional, territorial, humana e contemporânea, preservando integralmente autenticação, banco, vínculos Conector → Núcleo, providers, GeoJSON, 14 Núcleos, regras de progresso e registros existentes.

## Direção visual
- Manter Amsi Pro e a paleta oficial `#7F6AAF`, `#6B4FA0` e `#463868`.
- Acrescentar âmbar quente apenas em detalhes de energia, descoberta, percurso e na etapa Transformar.
- Usar superfícies claras com maior contraste e ritmo, evitando repetição de cartões brancos iguais.
- Introduzir cartografia sutil por meio de coordenadas, pontos, curvas topográficas e linhas de percurso sem representar conexões territoriais inexistentes.
- Usar apenas fotografias já disponíveis no projeto como imagens ilustrativas de território; nenhuma será apresentada como registro real de atividade.
- Manter a tipografia Condensed restrita a títulos de grande impacto e números, com Amsi Pro regular na interface e nos textos.

## Home e entrada
- Reorganizar a Home em uma abertura visual de alto impacto com título, mensagem, mapa oficial, fotografia territorial, CTA “Entrar na Jornada” e os indicadores reais de 14 Núcleos e 28 Conectores.
- Preservar o `MapaVivo`, o GeoJSON oficial, pontos, interações, tooltips e créditos cartográficos; alterar somente sua integração visual.
- Reconstruir as seções institucionais com maior presença de pessoas e território usando as imagens existentes e os conteúdos atuais.
- Criar a seção roxa “Uma Jornada em quatro dimensões” com percurso visual Explorar → Conectar → Descobrir → Transformar e destaque âmbar moderado em Transformar.
- Renovar visualmente Login e Primeiro Acesso sem tocar em autenticação, validação de e-mails, sessão ou identificação automática do Núcleo.

## Área autenticada
- Renovar o `AppShell` e a navegação inferior na ordem Territórios, Missões, Jornada, Relatórios e Perfil, com destaque discreto para Jornada no celular.
- Dar prioridade à Jornada com abertura compacta personalizada, contexto do Núcleo, papel do usuário e ação principal “+ Registrar atividade”.
- Transformar as quatro dimensões em uma trilha horizontal no desktop e uma sequência compacta no celular, usando exclusivamente os percentuais derivados dos registros existentes.
- Reorganizar a visão geral em: Sua Jornada, Resumo do período, Continue sua Jornada, Atividades recentes, Meu Núcleo e Pendências.
- Manter “Meu desempenho” sem pontuação protagonista e exibir apenas valores derivados ou estados neutros claramente identificados.
- Harmonizar Atividades, Missões, Relatórios, Perfil e Territórios com a nova linguagem, preservando formulários, status, filtros, mapa municipal e fluxos existentes.
- Manter todos os dados demonstrativos explicitamente sinalizados.

## Preservação funcional
- Não criar nem alterar tabelas, políticas, migrações ou dados.
- Não alterar autenticação, usuários, papéis, sessão ou vínculo automático com Núcleos.
- Não duplicar `MeuNucleoProvider` ou `RegistroAtividadeProvider`; todos os consumidores continuarão dentro da hierarquia atual.
- Não alterar cálculo automático de missões, validação, indicadores, relatórios ou rastreabilidade por Conector.
- Não reintroduzir Rede nem criar conexões visuais sem dados reais.

## Validação
- Verificar Home, Entrar, Territórios, Missões, Jornada, Relatórios e Perfil em desktop e celular.
- Testar navegação, login/primeiro acesso sem modificar credenciais, abertura e envio do formulário, filtros, relatórios e seleção do mapa.
- Confirmar ausência de overflow, sobreposição, erros de console, rotas quebradas e regressões de provider.
- Conferir metadados próprios de todas as páginas alteradas e acessibilidade dos controles.

## Fora desta etapa
- IA, pontuação ou ranking definitivos, premiação, administração completa, ArcGIS e integrações dinâmicas avançadas com GEOBASES.
- Novas métricas, números, relações territoriais ou fotografias tratadas como registros reais.