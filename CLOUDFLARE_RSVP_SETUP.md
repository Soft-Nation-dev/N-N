# Cloudflare RSVP deployment

The RSVP service is deployed as a separate Cloudflare Worker with a D1 database and a private vintage guest-ledger page. The existing GitHub Pages invitation submits responses to the Worker.

Current Worker URL: `https://vanilla-love-rsvp.ifeanyieee8105.workers.dev`

## Architecture

- Public invitation: the existing GitHub Pages site.
- Public submit endpoint: `POST /api/rsvps`.
- Private RSVP ledger: the root page of the Worker/custom subdomain.
- Protected list endpoint: `GET /api/admin/rsvps` with the administrator passphrase.
- Storage: Cloudflare D1 database `vanilla-love-rsvps`.
- Guest receipt: created in the invitation immediately after a successful D1 write.

## Existing production resources

- Worker: `vanilla-love-rsvp`
- D1 database: `vanilla-love-rsvps`
- D1 database ID: `f1a4c635-459f-4cc7-aca9-691354c5ece6`
- D1 migration `0001_create_rsvps.sql` is applied.
- `ADMIN_PASSWORD` and `RSVP_HASH_SALT` are stored as encrypted Worker secrets.

## Reprovisioning in another account

Run these commands from the project directory after signing in:

```powershell
npm exec -- wrangler login
npm exec -- wrangler d1 create vanilla-love-rsvps
```

Copy the returned `database_id` into the D1 entry in `wrangler.jsonc`, then create the two encrypted secrets:

```powershell
npm exec -- wrangler secret put ADMIN_PASSWORD
npm exec -- wrangler secret put RSVP_HASH_SALT
```

Use a long private passphrase for `ADMIN_PASSWORD`. Use a separate random value of at least 32 characters for `RSVP_HASH_SALT`.

Apply the schema and deploy:

```powershell
npm run rsvp:migrate:remote
npm run rsvp:deploy
```

## Custom subdomain

In Cloudflare, open the deployed `vanilla-love-rsvp` Worker, choose **Settings → Domains & Routes → Add → Custom Domain**, and attach the desired RSVP subdomain, such as `rsvp.example.com`.

The root of that subdomain displays the private guest ledger. Its `/api` paths serve the RSVP backend.

## Connect the invitation

The invitation already falls back to the current Worker URL in production. If a custom subdomain is added, open the GitHub repository's **Settings → Secrets and variables → Actions → Variables** and add:

```text
VITE_RSVP_API_URL=https://rsvp.example.com
```

Push or manually rerun the GitHub Pages workflow. The invitation will then submit to the live Worker.

For a local invitation build, copy `.env.example` to `.env.local` and set `VITE_RSVP_API_URL=http://localhost:8787`.

## Local development

Copy `.dev.vars.example` to `.dev.vars` and replace both sample values. Initialize the local database once:

```powershell
npm run rsvp:migrate:local
```

Then start the invitation and RSVP Worker together:

```powershell
npm run dev:all
```

The invitation runs on Vite and the RSVP ledger/API runs on port 8787. Use `npm run dev:all` for normal local testing; running only `npm run dev` starts the invitation UI without its local RSVP backend.

## Privacy and access

- The public endpoint can create responses but cannot list them.
- The guest ledger requires the administrator passphrase and does not persist it in browser storage.
- Guest IP addresses are not stored. A salted daily hash is used only for short-window submission throttling.
- Secrets belong in Cloudflare encrypted secrets or `.dev.vars`, never in Git.
