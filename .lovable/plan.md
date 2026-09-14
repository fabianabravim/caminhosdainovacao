# Tipografia oficial Amsi Pro

## Objetivo
Aplicar exclusivamente a família Amsi Pro fornecida, preservando integralmente cores, conteúdo, estrutura e comportamento.

## Implementação
- Extrair somente os arquivos oficiais necessários do pacote enviado, sem incluir metadados do arquivo compactado.
- Registrar Amsi Pro Regular, Semibold e Bold, além de Amsi Pro Condensed Semibold e Bold, com fallback sans-serif seguro.
- Centralizar as famílias e pesos em tokens globais reutilizáveis.
- Aplicar Amsi Pro ao corpo e à interface; aplicar Amsi Pro Condensed apenas a títulos, chamadas, números e títulos de cards.
- Manter textos longos na versão regular e controles na versão semibold.

## Validação
- Confirmar carregamento local das fontes e ausência de mudanças em cores ou funcionalidades.
- Revisar Home, Territórios e Jornada em 1440, 1024, 768, 430, 390 e 360 px.
- Verificar menus, títulos, cards, botões, ranking, indicadores, formulários e navegação móvel contra cortes, sobreposição e rolagem horizontal.
