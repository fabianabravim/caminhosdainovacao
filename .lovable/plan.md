# E-mail de recuperação — ROTA da Inovação

## Modelo proposto para aprovação

**Assunto:** Recuperação de senha | ROTA da Inovação

**Nome do remetente pretendido:** ROTA da Inovação

---

### Redefinição de senha

Olá, Conector(a)!

Recebemos uma solicitação para redefinir a senha de acesso à plataforma ROTA da Inovação.

Para criar uma nova senha e continuar sua experiência na plataforma, clique no botão abaixo.

**[Redefinir minha senha]**

Se você não solicitou essa alteração, pode ignorar este e-mail. Sua senha atual permanecerá válida.

**ROTA da Inovação**  
Uma plataforma do projeto Caminhos da Inovação.

---

## Apresentação visual
- Fundo branco, conteúdo em coluna única e espaçamento discreto, adaptado ao celular.
- Botão roxo institucional **#6B4FA0**, com texto branco.
- Marca oficial ROTA da Inovação no topo, preservando proporções, caso sua inclusão seja compatível com o envio. Sem fotografia ou imagens decorativas; sem recriar a marca.
- O botão deste documento representa a apresentação: não é um link de recuperação utilizável.

## Configuração atual e condição para aplicar
- A recuperação é enviada pela autenticação do **Lovable Cloud**. Não há templates personalizados de e-mail no código atual nem domínio de envio configurado; os e-mails de autenticação usam o remetente padrão do serviço.
- A personalização é configurada em **Mais → Emails → Auth emails**, no modelo de recuperação de senha. A geração de templates personalizados exige configurar um domínio de envio pertencente à usuária.
- Após aprovação deste modelo, abrir a configuração do domínio. A ativação do envio personalizado depende de sua verificação. Não substituir o remetente por um endereço Gmail.
- **Assunto e remetente acima são propostas, não alterações aplicadas.** O nome ROTA da Inovação será configurado no envio personalizado; o endereço dependerá do domínio verificado e será confirmado antes da ativação.

## Detalhes técnicos e limites
- Usar a geração oficial de templates de autenticação do Lovable Cloud, nunca um webhook ou template de autenticação manual.
- Alterar somente conteúdo e apresentação da recuperação. Preservar conteúdo, comportamento e assuntos dos demais tipos de e-mail ao configurar a infraestrutura compartilhada. Se isso não puder ser garantido, informar antes de aplicar.
- O botão receberá o link seguro gerado pelo serviço para cada solicitação, com o token e o redirecionamento existentes para a página de nova senha. Nenhuma URL fixa será colocada em seu lugar.
- Não alterar lógica de recuperação, autenticação, banco, permissões ou páginas da plataforma.
- Conferir a apresentação e as configurações efetivas antes de afirmar que assunto ou remetente foram alterados.
- **Nenhuma alteração de envio foi aplicada. Não publicar nem fazer deploy sem autorização explícita adicional.**