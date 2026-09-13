# Progresso automático das Missões do Território

## Objetivo
Remover o avanço manual em `/missoes` e fazer cada missão refletir automaticamente os registros válidos vinculados a ela, sem mudar nomes, pontos, identidade ou estrutura geral dos cards.

## Implementação
- Ampliar a configuração das nove missões com `meta_total`, fonte de progresso, rótulo do CTA e regra de validação.
- Preservar os valores demonstrativos atuais como registros mockados aprovados, eliminando o campo de progresso editável.
- Calcular `progresso_atual`, `percentual_progresso` e status a partir dos registros associados: Não iniciada, Em andamento, Em validação, Ajustes solicitados ou Concluída.
- Remover `avancarMissao` e qualquer controle capaz de alterar diretamente percentual, barra ou conclusão.
- Substituir “Registrar avanço” por CTAs específicos, abrindo um formulário de registro/evidência vinculado à missão.
- Manter novos envios como “Em validação”; apenas registros aprovados alimentarão definitivamente a barra.
- Mostrar nos cards a contagem `atual/meta`, o percentual calculado, o status automático e a recompensa quando concluída.

## Detalhes técnicos
- O estado guardará registros por missão, com situação de validação, em vez de números mutáveis de progresso.
- Seletores puros transformarão registros aprovados e pendentes na visualização calculada da missão.
- A arquitetura ficará pronta para substituir os mocks por cadastros reais de ativos, atividades, presenças, relatórios e articulações.
- A validação cobrirá envio de formulário, permanência do progresso até aprovação, status automático e inexistência do botão de avanço manual.
