# CAMINHOS DA INOVAÇÃO — Jornada da Inovação Capixaba

Plataforma gamificada de inteligência territorial para o IJSN / Governo do ES. Mobile first, dados simulados, visual institucional sofisticado (roxo profundo, violeta, lilás, acentos luminosos, neutros claros).

## Identidade visual

- Paleta: fundo roxo quase preto, superfícies violeta escuro, acentos lilás e um brilho ciano-lilás para conexões e comemorações.
- Tipografia: títulos em Sora, texto em Manrope.
- Cartões com cantos suaves, brilho sutil, linhas luminosas para a rede. Nada de aparência de painel genérico nem infantil.
- As 4 dimensões têm cores próprias e reaparecem em barras e gráficos: Explorar 🧭, Conectar 🤝, Descobrir 💡, Transformar 🚀.

## Telas

1. **Login imersivo** — mapa estilizado do ES ao fundo com núcleos pulsando, entrada direta no Núcleo Serra.
2. **Mapa Vivo (início)** — mapa interativo do ES com os 14 núcleos, conexões luminosas em rede viva; ao tocar em Serra abre painel: 72% concluído, 47 atores, 32 escutas, 18 conexões, 6 inovações, nível Conector, próximo Catalisador, botão "Continuar Minha Jornada". Conexões colaborativas (Serra + Caparaó) acendem no mapa.
3. **Minha Jornada** — trilha visual de progressão Explorador → Investigador → Conector → Catalisador → Embaixador da Inovação, 2.450 pontos, faltam 550; progresso por dimensão.
4. **Missões do Território** — missões nos 4 caminhos, com progresso, pontos de impacto e recompensas; seção de Missões Colaborativas; Desafio do Mês "Inovação que ninguém conhece" com contagem regressiva ao vivo.
5. **Descobertas** — cards editoriais com histórias e fotos do território (Caparaó, interior, serrana).
6. **Rede Capixaba de Inovação** — visualização de nós e conexões entre territórios, com filtros e detalhe de conexão.
7. **Conquistas & Badges** — conquistadas, em progresso, bloqueadas.
8. **Movimento dos Territórios (ranking)** — Top 3 Rio Doce, Caparaó, Vitória; Serra em 4º; filtros: pontos, maior evolução, mais colaborativo, mais conexões, mais descobertas.
9. **Inteligência do Território** — cards de insights e tendências simuladas.
10. **Perfil do Núcleo Serra** — dados do núcleo, os 2 conectores e feed de atividades recentes.

## Navegação

Bottom navigation fixa: Mapa, Missões, Jornada, Rede, Perfil. Conquistas, Descobertas, Inteligência e Ranking acessíveis a partir de Jornada/Perfil e de atalhos no início. Layout adapta para telas grandes.

## Microinterações

Comemoração sofisticada ao concluir missão (selo luminoso + pontos somando) e ao criar nova conexão (linha que acende no mapa). Animações contidas, sem confete infantil.

## Detalhes técnicos

- Rotas TanStack: `/` (login), `/mapa`, `/missoes`, `/jornada`, `/rede`, `/perfil`, `/descobertas`, `/conquistas`, `/ranking`, `/inteligencia`. Cada rota com título e descrição próprios.
- Camada de dados simulada modular em `src/data/` (núcleos, missões, dimensões, badges, ranking, descobertas, insights, atividades) com tipos em `src/types/`.
- Estado de progresso da sessão via contexto React, permitindo concluir missões e ver pontos subirem.
- Mapa e rede em SVG próprio (coordenadas estilizadas dos 14 núcleos), sem biblioteca de mapas.
- Tokens de cor em `src/styles.css`; componentes reutilizáveis (cartão de dimensão, barra de progresso, cabeçalho, bottom nav) em `src/components/`.
- Imagens do território geradas para as Descobertas e para o fundo do login.
