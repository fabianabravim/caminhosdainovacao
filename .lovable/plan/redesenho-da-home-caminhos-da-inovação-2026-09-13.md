# Redesenho da Home — Caminhos da Inovação

## Objetivo
Transformar somente a Home em uma apresentação progressiva e interativa sobre a inovação no Espírito Santo, preservando integralmente as páginas internas, a identidade visual roxo/violeta e a gamificação existente.

## Implementação

### 1. Mapa geográfico real
- Substituir o contorno desenhado manualmente pelo contorno oficial do Espírito Santo obtido da API de Malhas Geográficas do IBGE.
- Manter o mapa sem divisões internas inventadas; os 14 núcleos serão nós demonstrativos posicionados dentro do contorno real.
- Registrar “Fonte: IBGE” de forma discreta e deixar a estrutura pronta para futura integração com ArcGIS/GEOBASES.
- Preservar a API atual do mapa para não afetar as páginas internas; apenas a geometria e o posicionamento visual serão corrigidos.

### 2. Abertura territorial
- Criar cabeçalho discreto com marca, links para Sobre, Inovação, Territórios e Conectores, além de Entrar e Modo Apresentação.
- No desktop, usar texto à esquerda e um mapa grande à direita; no mobile, ordenar headline, mapa, texto e ações.
- Aplicar o novo texto institucional, os indicadores “14 territórios / 28 conectores / uma rede” e os CTAs “Explorar o mapa” e “Conheça o projeto”.
- Retirar da primeira tela XP, ranking, níveis, progresso e missões.

### 3. Mapa vivo e exploração
- Exibir nós com pulso discreto, conexões suaves, profundidade e brilho moderado.
- Destacar Serra apenas como núcleo do usuário.
- Mostrar dados do núcleo somente ao passar, focar ou tocar no ponto, com ação para explorar o território.
- Ao clicar em “Explorar o mapa”, aproximar visualmente o mapa e revelar na própria Home a seção “Mapa da Inovação Capixaba”, sem abrir imediatamente a área gamificada.

### 4. Storytelling progressivo
- Criar a seção clara “O que é inovação?” como uma composição conectada de cinco conceitos, sem cards repetitivos.
- Criar “Onde a inovação acontece?” com mapa, atores do ecossistema e conexões em movimento.
- Apresentar “Caminhos da Inovação” com 14 núcleos, 28 conectores, uma rede e uma trilha visual ligando Explorar, Conectar, Descobrir e Transformar.
- Encerrar em uma seção escura com “Sua jornada começa aqui” e transição de aproximação para o Núcleo Serra antes de entrar na aplicação já existente.

### 5. Responsividade e validação
- Garantir leitura, interação e proporções estáveis em desktop e mobile.
- Respeitar preferência por movimento reduzido.
- Manter o Modo Apresentação disponível e alimentado pelo mesmo mapa real.
- Validar visualmente a Home em desktop e mobile, incluindo menu, tooltips, exploração expandida e entrada na jornada.

## Limites
- Nenhuma página interna será redesenhada.
- Nenhuma geometria territorial interna será criada sem dados oficiais.
- A gamificação e seus dados permanecerão inalterados.
