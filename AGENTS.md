<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Admin actions run only in src/lib/admin.functions.ts: server checks ADMINISTRADOR in user_roles before using the privileged client — why: the admin area must be enforced server-side, not by hiding menus.
- perfis trigger blocks user edits to email/nucleo_id/ativo — why: users must not reassign their own Núcleo or reactivate themselves.
- Only projeto.caminhosdainovacao@gmail.com (COORDENACAO) and conector.caminhosdainovacao@gmail.com (CONECTOR test) may get an admin-set password via definirSenhaCoordenacao, which also syncs the auth e-mail — why: deliberate test-account exception; real users create their own password in Primeiro acesso.
