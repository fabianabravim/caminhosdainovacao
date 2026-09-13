# Revisão completa de responsividade da Jornada

## Objetivo
Corrigir exclusivamente a organização visual de `/jornada` em desktop, tablet, celular e celular pequeno, preservando integralmente conteúdo, dados, regras, identidade, mapa e lógica.

## Ajustes
- Tornar o cabeçalho e a identificação do participante flexíveis, empilhando ações e textos quando faltar largura.
- Aplicar containers fluidos, espaçamentos responsivos e proteção contra overflow horizontal.
- Empilhar conectores no celular e garantir que o mapa oficial permaneça inteiro, centralizado e limitado à largura disponível.
- Adaptar as quatro dimensões e os indicadores de progresso para grids adequados a cada breakpoint.
- Reorganizar os cards de missão em fluxo vertical no celular, com títulos quebráveis e botão de ação amplo.
- Tornar o ranking legível para nomes longos sem deslocar posição ou pontuação.
- Ajustar a navegação inferior e o formulário de evidência para áreas de toque, safe area e rolagem interna.

## Validação
- Conferir `/jornada` em 1440, 1024, 768, 430, 390 e 360 px.
- Testar ausência de scroll horizontal, cortes, sobreposições e botões fora da tela.
- Abrir e usar o formulário de uma missão em desktop e celular.
- Confirmar que mapa, ranking, textos e valores permanecem inalterados.

## Detalhes técnicos
- Usar os breakpoints existentes e variantes responsivas locais aos componentes da Jornada.
- Não alterar a Home, outras páginas, dados mockados, estado, cálculos ou configuração das missões.