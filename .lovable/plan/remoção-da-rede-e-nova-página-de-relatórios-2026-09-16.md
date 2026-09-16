# Remoção da Rede e nova página de Relatórios

## Alterações

- Remover a rota `/rede` e o recurso visual exclusivo dessa tela, eliminando o acesso à antiga funcionalidade.
- Substituir “Rede” por “Relatórios” na navegação inferior, mantendo exatamente: Territórios, Missões, Jornada, Relatórios e Perfil.
- Criar `/relatorios` dentro da área autenticada, reutilizando o contexto e o formulário de atividades já existentes.
- Exibir somente os relatórios do conector conectado, com os status: Pendente, Enviado, Em análise, Aprovado e Ajustes solicitados.
- Disponibilizar a ação “+ Novo Relatório”, abrindo o fluxo de registro de relatório já existente.
- Manter a seção de Relatórios interna à Jornada funcional, sem confundi-la com a nova página própria.

## Detalhes técnicos

- A nova rota ficará sob a proteção autenticada já existente e usará um único `MeuNucleoProvider` e `RegistroAtividadeProvider`.
- Os estados já persistidos serão apenas apresentados com a terminologia solicitada; não haverá mudança no banco, autenticação, pontuação ou validação.
- A rota antiga e seus imports exclusivos serão removidos; menções conceituais legítimas a redes dentro de textos de missões ou da Home não serão alteradas.
- A navegação e a nova tela serão verificadas em desktop e celular, incluindo acesso, botão de novo relatório e ausência de referências à antiga tela.
