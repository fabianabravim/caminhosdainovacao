# Fluxo de acesso testável dos Conectores

## Objetivo
Transformar a tela de entrada atualmente demonstrativa em um acesso real e restrito, identificando automaticamente o Conector e seu Núcleo, sem alterar a Home, os mapas, as missões, a gamificação ou a estrutura visual da Jornada.

## Implementação

### 1. Acesso autorizado
- Ativar autenticação por e-mail e senha no Lovable Cloud.
- Manter “Entrar” e “Primeiro acesso” na tela atual.
- No Primeiro Acesso, aceitar somente e-mails previamente autorizados como Conector ou Coordenação.
- Permitir que a própria pessoa defina sua senha; nenhuma senha ficará no código ou nos dados demonstrativos.
- Não oferecer escolha de Núcleo em nenhuma etapa.

### 2. Cadastros e vínculos
- Criar os 14 Núcleos Territoriais na base, usando os nomes oficiais já existentes.
- Criar perfis vinculados às contas de acesso, contendo nome, e-mail, núcleo e status ativo.
- Manter papéis em estrutura separada e segura, com os perfis `CONECTOR` e `COORDENACAO`.
- Preparar três autorizações claramente marcadas como demonstração: Conector Teste 01, Conector Teste 02 e Coordenação Teste.
- Vincular os dois Conectores de teste ao Núcleo Serra; a Coordenação ficará preparada para a etapa administrativa futura.

### 3. Jornada protegida
- Mover `/jornada` para a área protegida, mantendo exatamente a mesma URL e a mesma apresentação.
- Redirecionar visitantes sem sessão para `/entrar`, preservando a intenção de acessar a Jornada.
- Carregar o nome, papel e Núcleo do perfil autenticado antes de exibir a Jornada.
- Exibir “Olá, Conector Teste 01/02” e “Núcleo Serra” conforme a conta usada.
- Implementar “Sair” com limpeza segura da sessão e retorno à entrada.

### 4. Dados individuais e coletivos
- Vincular cada atividade ao `conector_id` e ao `nucleo_id` automaticamente, sem campos editáveis no formulário.
- Mostrar em “Minhas Atividades” somente os registros do Conector autenticado.
- Calcular “Meu desempenho” a partir dos registros individuais do usuário.
- Calcular progresso, missões, indicadores e feed do Núcleo usando os registros coletivos do Núcleo Serra, visíveis aos dois Conectores.
- Preservar as regras atuais de validação e progresso automático.

### 5. Validação
- Testar acesso direto sem sessão, Primeiro Acesso, login, recarga com sessão mantida e saída.
- Testar separadamente os dois Conectores e confirmar identidade individual, mesmo Núcleo e atividades individuais independentes.
- Verificar desktop e mobile sem alterar a estrutura visual existente.
- Documentar os e-mails demonstrativos, a URL, o procedimento de primeiro acesso, a confirmação de e-mail e a localização dos dados de teste.

## Limites
- Nenhuma senha demonstrativa fixa será criada.
- Não haverá cadastro público livre, escolha de Núcleo ou painel administrativo nesta etapa.
- Home, identidade, mapas, missões, pontuação e regras de gamificação permanecerão inalterados.
