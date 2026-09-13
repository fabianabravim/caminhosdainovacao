# Territórios da Inovação

## Objetivo
Transformar exclusivamente `/mapa`, acessado como “Territórios”, em uma experiência de exploração municipal do Espírito Santo. A Home, a Jornada e as demais áreas permanecem inalteradas.

## O que será construído
- Substituir o conteúdo gamificado atual de `/mapa` por um mapa municipal protagonista, mantendo o cabeçalho e a navegação existentes.
- Incorporar ao projeto a malha oficial dos 78 municípios do Espírito Santo, sem redesenho ou polígonos aproximados.
- Exibir limites municipais sutis, destaque ao passar o mouse, foco por teclado, tooltip com nome e seleção por clique/toque.
- Abrir um painel lateral com município, Núcleo Territorial e os quatro indicadores solicitados; enquanto não houver cadastro oficial, todos aparecem como “Dados em construção”.
- Adicionar busca por município ou território, com seleção que destaca a geometria e abre o painel.
- Adicionar o seletor “Municípios / Núcleos Territoriais”. O modo municipal funcionará agora; o modo de núcleos ficará claramente preparado e indisponível até o recebimento da associação oficial município → núcleo.
- Exibir o controle de camadas futuras sem dados fictícios: Municípios ativo; Núcleos Territoriais dependente da associação oficial; demais camadas desativadas.
- Usar o título e o texto institucional fornecidos e informar discretamente a fonte cartográfica real.

## Comportamento esperado
- Desktop: mapa amplo e painel de informações ao lado, sem reduzir o território a um pequeno cartão.
- Celular: mapa preserva proporção e o painel abre como uma camada inferior acessível, sem sobreposições.
- Busca, mouse, teclado e toque conduzem à mesma seleção municipal.
- Nenhum município será associado a um dos 14 Núcleos enquanto a composição oficial não for fornecida.

## Detalhes técnicos
- Fonte: API de Malhas Territoriais do IBGE, Estado 32, intrarregião município, com 78 feições oficiais e nomes unidos pelo código IBGE a partir da API de Localidades.
- Geometria armazenada localmente em GeoJSON para carregamento estável e sem dependência de rede no navegador.
- Novo componente municipal isolado do `MapaVivo`, evitando qualquer alteração no mapa compartilhado pela Home e pelo Modo Apresentação.
- Projeção WGS84 para SVG calculada a partir do bounding box da própria camada municipal, preservando proporção e ilhas presentes no arquivo oficial.
- Metadados próprios de `/mapa` atualizados com título, descrição, Open Graph, `og:type` e Twitter Card.

## Validação
- Confirmar as 78 geometrias e nomes municipais.
- Testar hover/foco, busca, clique, painel, seletor e camadas.
- Conferir desktop e celular, incluindo textos sem cortes e ausência de erros no navegador.
- Verificar que arquivos da Home e das demais páginas não foram modificados.
