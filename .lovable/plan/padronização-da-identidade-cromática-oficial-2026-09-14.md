# Padronização da identidade cromática oficial

## Objetivo
Atualizar somente as cores do projeto para a identidade institucional fornecida, preservando integralmente estrutura, textos, componentes, funcionalidades, geometria dos mapas e responsividade.

## Implementação
- Centralizar em `src/styles.css` os tokens oficiais: principal `#7F6AAF`, secundária `#6B4FA0` e escura `#463868`, incluindo variações de interação derivadas dessas mesmas cores.
- Remapear os tokens semânticos existentes para que botões, navegação, links, cartões, fundos, bordas, badges e indicadores adotem automaticamente a paleta oficial.
- Substituir brilhos ciano/neon, gradientes aleatórios e roxos saturados por combinações discretas das três cores oficiais.
- Padronizar as quatro dimensões da Jornada com variações institucionais da paleta, mantendo ícones, nomes, regras e diferenciação visual.
- Atualizar as cores internas dos mapas e da visualização de rede para usar os tokens oficiais, sem alterar geometria, coordenadas, pontos ou interações.
- Preservar cores funcionais de sucesso, alerta e erro apenas nos estados em que comunicam status.
- Atualizar a cor do navegador para a cor escura oficial.

## Validação
- Conferir contraste dos botões e textos sobre as três cores oficiais.
- Verificar Home, Territórios e Jornada em desktop e mobile.
- Confirmar que não há regressões visuais, erros de execução ou alterações de conteúdo e funcionalidade.
