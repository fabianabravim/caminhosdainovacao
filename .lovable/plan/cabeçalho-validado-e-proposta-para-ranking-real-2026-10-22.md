# Cabeçalho validado e proposta para ranking real

## Cabeçalho: resultado da verificação

O código atual já mantém o cabeçalho no topo durante a rolagem. Não foi necessário modificar a aplicação nem acrescentar uma segunda barra.

- Testado com sessão real da Administradora, nas cinco abas: Visão geral, Atividades, Missões, Relatórios e Meu Núcleo.
- Computador 1440 × 900, tablets 768 × 1024 e 1024 × 768, celular 390 × 844: marca, links e perfil permanecem visíveis; nenhuma rolagem horizontal.
- Formulário de atividade abre acima do cabeçalho; foco por teclado permanece visível; nenhum formulário foi enviado.
- Sem erros de execução observados; última verificação da compilação sem erros.
- A versão local foi verificada, não a sessão aberta no navegador da usuária. Se o cabeçalho ainda desaparecer no Preview, entrar em Jornada e recarregar o Preview. Se persistir, informar a aba e enviar uma captura para reproduzir a diferença; não há evidência que justifique alterar CSS agora.

## Ranking: diagnóstico

| Ponto | Resultado |
|---|---|
| Valores fictícios | Constantes em `src/data/ranking.ts`: Rio Doce 3.480, Serra 2.450 e demais valores. Não são resultados de atividades. |
| Onde aparecem | `src/components/jornada/RankingNucleos.tsx`, utilizado em Jornada → Meu Núcleo, e a página `/ranking` em `src/routes/ranking.tsx`. |
| Fonte persistida | `atividades_conectores`: Núcleo, missão principal, fonte de contribuição, status e vínculos relacionados. |
| Cálculo existente | `src/context/MeuNucleoContext.tsx`: progresso limitado à meta; soma os pontos da missão uma única vez quando o estado calculado é concluída. |
| Configuração das missões | `src/data/missoes.config.ts`; preservar IDs, metas, fontes e pontos. Movimentos não precisam ser alterados. |
| Registros atuais | Consulta somente leitura retornou nenhuma atividade na tabela. Não há atividades a apagar ou corrigir. Nesse estado, o ranking real deve mostrar os 14 Núcleos com 0 pontos, todos empatados. |
| Carregamento e falhas | Ranking estático não distingue consulta em andamento, erro ou resultado sem pontos. O carregamento geral da Jornada não substitui esses estados. |
| Atualização automática | Ranking não consulta dados; provider atual carrega atividades inicialmente e atualiza seus próprios envios, mas não acompanha validações externas automaticamente. |

### Limites importantes encontrados

1. **Visibilidade estadual:** hoje Conectores leem atividades apenas do próprio Núcleo; Coordenação pode ler todos. Administradora não recebe acesso estadual às atividades pela política atual. Não existe consulta agregada de ranking pronta. Buscar todos os registros no navegador produziria um ranking incompleto — não se pode interpretar dados invisíveis como zero.
2. **Condição de conclusão:** o cálculo atual exige meta atingida por aprovações **e nenhuma atividade vinculada pendente ou com ajustes**. Portanto, meta aprovada com pendência adicional ainda não concede pontos pela regra atual. A proposta preserva esse comportamento; alterá-lo seria outra decisão, fora deste escopo.
3. **Anti-duplicidade:** pontos são somados uma vez por missão e o progresso é limitado à meta. Isso não equivale a detectar atividades duplicadas por conteúdo; nenhuma nova regra desse tipo será introduzida.
4. **Demonstração:** existe um marcador de atividade demonstrativa, que o cálculo atual da Jornada não exclui. Para o ranking exclusivamente real, excluir esses registros apenas da consulta do ranking, preservando-os e sem mudar o cálculo das outras telas.
5. **Página antiga:** `/ranking` também contém filtros demonstrativos de evolução, colaboração, conexões e descobertas, além de destaque fixo de Serra. Tornar essa página um ranking real de pontos exige retirar esses filtros dessa apresentação, sem apagar suas bases usadas em outras funcionalidades.

## Implementação mínima proposta — ainda não autorizada

1. Extrair o cálculo existente de missão e pontuação para uma função compartilhada, mantendo exatamente as regras atuais. Usá-la no ranking e na Jornada para evitar divergências.
2. Disponibilizar uma leitura segura dos totais dos 14 Núcleos, sem nomes de pessoas, e-mails, descrições, evidências ou atividades individuais. **Dependência a aprovar:** o acesso a totais estaduais precisa de um caminho autorizado no servidor; as permissões atuais do navegador não bastam. Não ampliar políticas de leitura das atividades nem realizar migração. Não usar um cliente privilegiado como simples atalho para contornar as restrições atuais. A solução e sua autorização específica devem ser definidas antes desta parte da execução.
3. Preencher os 14 Núcleos a partir do cadastro oficial e somar somente missões concluídas pelo cálculo preservado, com teto de 2.780 pontos por Núcleo. Excluir atividades demonstrativas do ranking; ausência real de contribuições retorna 0, falha de consulta não retorna zeros fictícios.
4. Atualizar o ranking de Meu Núcleo e o ranking antigo de pontos com a mesma fonte, sem misturar indicadores demonstrativos. “Seu núcleo” deriva do perfil autenticado; Coordenação sem vínculo não recebe destaque fictício.
5. Ordenar por pontos decrescentes, com posição compartilhada nos empates; usar ordem alfabética apenas para apresentação. Exemplo: 1º, 1º, 3º; todos com zero aparecem em 1º empatados, sem pódio artificial.
6. Incluir carregamento, falha com nova tentativa e resultado válido zerado. Atualizar na abertura, retorno à janela, após alterações pertinentes e por consulta periódica enquanto o ranking estiver visível, sem escrever registros.

### Arquivos previstos

- Função compartilhada de cálculo e testes novos, próximos aos testes existentes.
- `src/context/MeuNucleoContext.tsx`: apenas reutilização do mesmo cálculo, sem mudança de regra.
- Fonte de consulta agregada autorizada, se sua autorização específica for resolvida.
- `src/components/jornada/RankingNucleos.tsx` e `src/routes/ranking.tsx`: usar ranking real e estados de consulta.
- Não alterar os movimentos, autenticação, papéis, banco ou demais funcionalidades.

## Testes de aceitação previstos

- 14 Núcleos sem aprovações: 0 pontos, todos empatados.
- Atividade pendente, rejeitada ou com ajustes: nenhum ponto concedido por ela.
- Meta parcial: 0 pontos da missão.
- Meta completa aprovada, sem pendências vinculadas: pontuação integral uma vez, inclusive com aprovações excedentes.
- Meta aprovada com pendência extra: preservar o estado de conclusão atual.
- 12 missões concluídas: teto 2.780; subtotais 500 / 400 / 920 / 960 preservados.
- Atividades demonstrativas não entram no ranking real.
- Mudança de pontos reordena a lista e recalcula empates.
- Diferentes perfis recebem o mesmo total por Núcleo, sem acesso aos registros individuais de outros territórios.
- Recarregar preserva resultados; falha de consulta mostra erro, não zeros.
- Validação visual em computador, tablet e celular e leitura de dados existentes sem alteração. Como a tabela está vazia, cenários de pontuação positiva devem ser testados com fixtures automatizadas, não com atividades artificiais no banco.

## O que permanece preservado

Nenhum código da aplicação, ranking, registro, autenticação ou permissão foi modificado nesta auditoria; nenhuma publicação realizada. Cabeçalho já atende à permanência durante rolagem na versão testada. Implementação do ranking depende de aprovação e da resolução explícita do acesso seguro aos totais estaduais.