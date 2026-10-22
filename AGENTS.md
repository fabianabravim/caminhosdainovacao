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
- Mission → official movement (Reconhecer/Ouvir/Traduzir/Articular) comes only from the explicit table in src/data/movimentos.ts, never from mission ID prefixes; legacy `dimensao` stays for older components — why: persisted missao_id values must remain unchanged.
- Mission completion and points use the pure helpers in src/data/pontuacao.ts, with the original approved-goal/no-pending/no-adjustments condition — why: scoring consumers must share the same preserved rules.
- Connector Journey/missions use src/data/movimentos.apresentacao.ts for shared movement presentation, deriving order/names from movimentos.ts; never define membership in presentation data — why: UI stays consistent without changing legacy data or progression rules.
- Authenticated headers use AppShell and the existing official Caminhos logo asset; preserve route-provided titles and role subtitles. Page-local navigation uses AppShell's navegacao slot with its state owned by the page, never replaces BottomNav — why: shared branding must preserve profile context and separate local tabs from app routes.
- Activity form usability helpers live in registroAtividadeFormulario.ts; use Radix modal focus management and test through a mocked registration context with vitest.registro.config.ts — why: validation, discard and concurrent-submission tests must never persist real activities or replace the existing association/writer.
