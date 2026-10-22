# Etapa 3B — Validação e Segurança das Atividades

## Escopo desta entrega

Análise técnica e proposta, sem implementação. A Etapa 3A está aprovada. Nenhum código da aplicação, registro, permissão, armazenamento, configuração de autenticação ou banco foi modificado; nada foi publicado. Foram consultados o código, as migrações do repositório e o esquema/políticas atuais por ferramenta somente leitura, sem consultar conteúdos pessoais das atividades.

As etapas abaixo dependem de autorização expressa. A aprovação desta análise não implica autorização para alterar a regra das missões automáticas, reclassificar registros históricos ou publicar.

## 1. Diagnóstico atual

| Área | Situação confirmada | Consequência |
|---|---|---|
| Registro | `MeuNucleoContext.tsx` grava diretamente em `atividades_conectores`; status inicial calculado no navegador | Uma requisição manipulada pode enviar status diferente do mostrado no formulário |
| Permissões | INSERT exige Conector, autoria e Núcleo; UPDATE permite ao autor alterar a própria linha sem restringir status; DELETE permite excluir a própria atividade | Possibilidade de autoaprovação, alteração de vínculos e perda de histórico; o problema não se resolve escondendo botões |
| Leitura | Próprio Núcleo ou COORDENACAO; não há regra transversal explícita para ADMINISTRADOR | A Administradora não deve depender de um segundo papel nem de um Núcleo fictício para revisar todos os territórios |
| Validação | Coordenação acompanha listas, sem ações de decisão | Não há ciclo operacional de aprovação/ajustes |
| Parecer e histórico | Existem criação/última atualização, mas não parecer, avaliador ou versões anteriores | Não é possível provar quem decidiu, quando e sobre qual conteúdo |
| Missão | Pode ser recebida da abertura por missão; sem escolha explícita no formulário; ID informado não é validado contra o tipo no escritor | Vínculo incompatível pode determinar fonte e aprovação inicial |
| Evidências | Foto/documento armazenam nomes; não há bucket de arquivos no projeto | Nome de arquivo não é evidência acessível nem upload realizado |
| Duplicidade | Bloqueio de envio simultâneo na interface, sem idempotência persistente | Repetição por rede/recarregamento ou cliente modificado pode gerar duas linhas |
| Pontuação | Uma contribuição por atividade; pontos uma vez por missão concluída | A regra é preservável, mas pressupõe dados e status confiáveis |

Status já existentes: `rascunho`, `enviada`, `em_validacao`, `aprovada`, `ajustes_solicitados`. Não propor rejeição, arquivamento ou novos estados pontuáveis nesta etapa: exigiriam decisão metodológica e compatibilidade próprias.

## 2. Fluxo proposto

1. **Registro:** identificar autor e Núcleo pela sessão/perfil ativo; escolher tipo e missão compatíveis; servidor determina fonte e status. O formulário nunca define autoria, Núcleo, aprovação ou avaliador.
2. **Envio:** para missões que exigem revisão, salvar em `em_validacao`, registrar versão e evento de envio na mesma transação. Não é necessário acrescentar um estado entre envio e análise.
3. **Análise:** Coordenação ou Administradora abre a atividade, sua versão e os anexos autorizados.
4. **Decisão:** aprovar ou solicitar ajustes. Registrar responsável, papel no momento da decisão, data gerada pelo banco, status anterior/novo e parecer. Parecer obrigatório para ajustes; recomenda-se justificativa breve também na aprovação.
5. **Correção:** autor visualiza parecer e corrige somente atividade em `ajustes_solicitados`. A versão corrigida é preservada sem sobrescrever a versão avaliada.
6. **Reenvio:** atualizar a mesma atividade para `em_validacao`, com nova revisão e evento; não criar outra atividade nem contribuição.
7. **Nova decisão:** revisão do conteúdo reenviado, mantendo todas as decisões anteriores.

Conteúdo enviado ou aprovado fica bloqueado para edição direta. Não incluir reabertura de uma atividade aprovada neste fluxo mínimo; se necessária, deverá ser autorizada e auditada separadamente. Rascunho já é um estado previsto, mas a interface de salvar rascunhos não precisa integrar a primeira entrega.

**Concorrência:** uma decisão só vale para a revisão que o avaliador abriu. Dois avaliadores decidindo simultaneamente ou uma tela desatualizada devem produzir conflito explícito, nunca sobrescrever silenciosamente uma decisão.

## 3. Matriz de permissões proposta

Todas as ações exigem sessão válida e perfil ativo. Os papéis vêm de `user_roles`, nunca de valores enviados pelo navegador.

| Ação | Conector autor | Outro Conector | Coordenação | Administradora |
|---|---|---|---|---|
| Criar atividade | Próprio Núcleo | Próprio registro | Não por este fluxo | Não por este fluxo |
| Ler atividades coletivas | Próprio Núcleo | Próprio Núcleo | 14 Núcleos | 14 Núcleos |
| Ler parecer e anexos | Próprias atividades | Não, por padrão | 14 Núcleos | 14 Núcleos |
| Editar conteúdo | Própria, em rascunho/ajustes | Não | Não substituir conteúdo do autor | Não substituir conteúdo do autor |
| Reenviar | Própria, após ajustes | Não | Não | Não |
| Aprovar/solicitar ajustes | Não | Não | Sim | Sim |
| Alterar autor/Núcleo/decisão diretamente | Não | Não | Não | Não |
| Apagar atividade enviada ou histórico | Não | Não | Não | Não |
| Gerenciar usuários e papéis | Não | Não | Não | Fluxo administrativo atual |

Propõe-se parecer/anexos restritos ao autor e avaliadores; o resumo coletivo atual permanece disponível ao Núcleo. Compartilhar pareceres/anexos entre os dois Conectores exige autorização específica. Conta inativa e visitante não acessam o fluxo. Caso alguém acumule papel avaliador e autoria, bloquear a avaliação da própria atividade.

## 4. Modelo mínimo de dados e histórico — detalhes técnicos

### Atividade existente

Preservar tabela, IDs, conteúdo, `missao_id`, fontes, Núcleo e datas existentes. Propor apenas campos aditivos de controle: número de revisão e chave de idempotência nullable para legado, com unicidade por autor quando preenchida. Não usar `updated_at` como substituto de histórico.

### Histórico imutável de eventos/revisões

Nova tabela vinculada à atividade, contendo: ID, atividade, revisão, tipo de evento, status anterior/novo, responsável UUID, papel no momento do evento, data do banco, parecer e cópia dos campos relevantes da versão enviada/avaliada. Eventos: envio, aprovação, solicitação de ajustes e reenvio; revisão corrigida preservada no reenvio.

Sem INSERT/UPDATE/DELETE livre pelo navegador. Escrita somente pela operação autorizada. Evento e mudança da atividade na mesma transação; falha de qualquer parte cancela ambas. A trilha registra identidade do responsável sem expor e-mail desnecessariamente.

### Anexos

Nova tabela de metadados: ID, atividade, revisão, bucket/caminho opaco, nome original para exibição, tipo validado, tamanho, autor, data e estado de disponibilização. Anexos antigos não são substituídos fisicamente ao reenviar: novas versões ficam vinculadas à nova revisão.

Os nomes atualmente salvos continuam identificados como referências legadas sem arquivo disponível. Não inventar upload, avaliador, parecer nem decisões passadas. Qualquer reconstrução de histórico anterior dependeria de fonte verificável e autorização separada.

### Serviços e proteção no banco

- Funções autenticadas de registro, correção/reenvio, revisão e acesso aos anexos, usando `createServerFn` e a sessão já existente.
- Operações transacionais no banco verificam novamente papel, perfil ativo, autoria, Núcleo, versão e transição; bloqueiam linha durante a decisão.
- Retirar a capacidade de gravação direta ampla e disponibilizar operações específicas com campos permitidos; não apenas acrescentar política permissiva, pois ela não neutraliza a atual.
- RLS para atividade, histórico e anexos; incluir leitura transversal explícita para Administradora e leitura própria do autor inclusive quando estados não forem coletivamente visíveis.
- Funções com privilégio elevado, se necessárias para transações protegidas, com identidade autenticada verificada internamente, permissões de execução restritas e caminhos fixos. Sem endpoint público ou uso de cliente privilegiado como atalho para leituras comuns.
- Manter ações administrativas em `admin.functions.ts`; Coordenação recebe serviço de avaliação próprio, sem acesso à gestão de usuários.
- Migrações futuras aditivas, com GRANTs explícitos compatíveis com as políticas. Não criar perfil novo nem alterar o fluxo de autenticação.

## 5. Missão explícita e compatibilidade

Oferecer somente missões ativas cuja `fonteProgresso` esteja entre as fontes permitidas pelo tipo. Ao abrir por uma missão, pré-selecioná-la; ao mudar o tipo, limpar uma seleção incompatível e exigir escolha válida.

Tipos sem fontes, como reunião/visita/outro, podem continuar como registro sem contribuição de missão, com esse resultado explícito. Servidor valida novamente tipo, missão ativa e compatibilidade; deriva a fonte, sem confiar na fonte enviada.

Preservar **uma atividade → uma missão contabilizada**. Fontes possíveis e `missoes_relacionadas` não geram múltiplas contribuições. Movimentos derivados exclusivamente de `src/data/movimentos.ts`. Vínculos históricos não são recalculados; eventuais incompatibilidades legadas devem ser apenas auditadas antes de qualquer correção.

## 6. Duas missões automáticas e decisão institucional

| Missão | ID | Meta | Pontos |
|---|---|---:|---:|
| Mapear ativos de inovação | `exp-mapear-ator` | 10 | 180 |
| Identificar ambientes de inovação | `exp-ambiente` | 5 | 120 |

Ambas pertencem a Reconhecer e hoje têm `exigeValidacao: false`; o navegador atribui `aprovada` na criação.

**Proposta compatível com as restrições atuais:** manter a aprovação automática exclusivamente para essas duas missões, mas determiná-la em operação protegida no servidor/banco, após validar vínculo, conteúdo obrigatório e repetição técnica. Registrar evento identificado como decisão automática, com autor do envio, data e versão da regra; não atribuir ficticiamente a aprovação à Coordenação.

**Alternativa institucional mais rigorosa:** exigir avaliação humana também nessas duas missões. É uma mudança de política de aprovação e NÃO está incluída na proposta mínima; necessita autorização explícita, definição de vigência e tratamento dos novos envios, sem rebaixar registros antigos automaticamente. Validação técnica não comprova, por si só, a existência real de um ativo ou ambiente.

## 7. Evidências privadas reais

Criar bucket privado pelo serviço de armazenamento Lovable Cloud, somente quando autorizado. Restringir envio a autor ativo em estado editável e leitura ao autor/avaliadores; aplicar as mesmas verificações ao download e à emissão de links temporários.

Proposta inicial: fotos JPEG/PNG e documentos PDF; tamanho e quantidade máximos devem ser definidos antes de ativar. Validar tamanho, assinatura real do arquivo e tipo, não apenas extensão. Rejeitar formatos ativos/executáveis; nomes e caminhos seguros, sem e-mails. Downloads de documentos como anexo e links assinados curtos, renováveis após nova autorização. Links temporários são compartilháveis durante a validade, portanto não equivalem a controle absoluto de cópia.

Uploads usam caminhos únicos sem sobrescrita. Vincular arquivo somente após envio concluído; tratar falha/cancelamento e limpeza de objetos órfãos sem apagar evidências históricas. Arquivo validado não significa arquivo livre de malware: varredura adicional requer serviço compatível e avaliação separada de custo. Alertar sobre dados pessoais em fotos/documentos e definir retenção e consentimento institucional.

## 8. Duplicidade e pontuação preservada

- Chave de idempotência persistente por intenção de envio: retries retornam a atividade existente; mesma chave com conteúdo diferente é erro.
- Reenvio conserva ID e aumenta revisão; eventos/anexos nunca entram no cálculo como novas atividades.
- Duplicatas semânticas: sugerir alerta por Núcleo, missão, data e conteúdo normalizado; não bloquear automaticamente ações legítimas semelhantes nem excluir históricos. Um identificador de ativo/ambiente permitiria controle mais preciso, mas exige definição institucional.
- Cada atividade atual contribui uma vez; decisões repetidas e junções de anexos não multiplicam linhas contadas.

Manter `pontuacao.ts`: somente aprovados avançam a meta, progresso limitado à meta/100%, conclusão exige meta aprovada e nenhuma pendência ou ajuste vinculado; pontos uma vez por missão. Uma missão pode estar em 100% e ainda não concluir; novo envio pendente pode retirar temporariamente seus pontos segundo a regra existente. Não introduzir pontuação cumulativa irreversível.

Subtotais preservados: Reconhecer 500; Ouvir 400; Traduzir 920; Articular 960; **12 missões, teto 2.780 por Núcleo**. Não modificar ranking nesta etapa.

## 9. Implementação em pequenas etapas, após autorização

1. **3B.1 — Contrato e segurança:** definir permissões/transições, manter decisão sobre automáticas, operações transacionais, idempotência e histórico; fechar gravação direta e exclusão indevidas. Testar antes de ativar o fluxo.
2. **3B.2 — Associação:** seleção explícita compatível, validação no servidor, contribuição única e mensagens claras; preservar legado.
3. **3B.3 — Revisão e reenvio:** fila/detalhe para avaliadores, parecer, decisões, histórico; detalhe e correção nas Minhas atividades; conflitos e erros visíveis.
4. **3B.4 — Evidências:** armazenamento privado, anexos versionados, limites, autorização de leitura e falhas de upload.
5. **3B.5 — Homologação:** testes completos por perfil e auditoria final, sem publicação automática.

**Cuidado de implantação:** preview e site publicado compartilham o mesmo backend. Uma migração de permissões afeta o site atual mesmo sem publicação. Preparar ambiente isolado de homologação e sequência compatível antes de executar 3B.1; não aplicar proteção que deixe o escritor antigo em produção incapaz de registrar sem uma transição aprovada.

Principais arquivos afetados futuramente: `MeuNucleoContext.tsx`, tipos de atividade/contexto, `RegistroAtividade.tsx`, helpers e testes, `MinhasAtividades.tsx`, `coordenacao.tsx`, serviços de atividades e `admin.functions.ts` quando houver ação administrativa, migrações e regras de armazenamento. `missoes.config.ts`, `movimentos.ts` e `pontuacao.ts` permanecem fontes preservadas; não reescrever metas/pontos/mapeamento para implementar o fluxo.

## 10. Estratégia de testes sem alterar registros reais

- Unitários: tipo/missão compatíveis e incompatíveis, transições, duas automáticas exatas, contribuição única e idempotência.
- Segurança em banco isolado: ataques diretos a status, autoria, Núcleo, fonte, histórico e anexos; visitante, inativo, autor, outro Conector, Coordenação e Administradora; proibir autoavaliação.
- Transações: duas decisões concorrentes, decisão sobre versão antiga, erro ao gravar parecer/evento e rollback integral.
- Fluxo com dados exclusivamente de teste: registrar → solicitar ajustes → ler parecer → corrigir → reenviar → aprovar; automático seguro; repetir requisição sem duplicar.
- Armazenamento isolado: arquivo inválido/grande, interrupção, acesso indevido, URL expirada, revisão anterior e limpeza de órfãos.
- Regressão: 12 IDs, metas/pontos originais, 500/400/920/960 e 2.780; pendências/ajustes bloqueando conclusão, excedente sem pontos adicionais e histórico sem contribuição extra.
- Interface: testes simulados do formulário; avaliação em computador e 320/375/390/430 px, foco, erros e botões existentes. Nenhum envio de teste no backend compartilhado real.

**Executado nesta análise:** 29 testes existentes passaram — 12 de formulário, 8 de movimentos e 9 de pontuação. A suíte de movimentos/pontuação foi executada novamente: 17 passaram, não são 17 casos adicionais. Não foram executados ataques ou envios no banco real. Estes testes comprovam a base existente, não um fluxo 3B ainda inexistente.

## Decisões pendentes antes da implementação

- Ratificar escopo transversal de Coordenação e Administradora e a restrição de parecer/anexos ao autor e avaliadores.
- Manter automáticas protegidas (proposta mínima) ou autorizar separadamente revisão humana.
- Definir limites e retenção dos anexos; definir critério institucional para duplicatas semânticas.
- Autorizar etapa específica e homologação isolada antes de migrações. Sem essa autorização, a plataforma permanece como está.