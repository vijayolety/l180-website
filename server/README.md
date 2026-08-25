# Our Work - backend (Node + MySQL, deployed on Railway)

**Status: deployed.** Project `l180-work-backend` on Railway, live at
`https://backend-production-b3e9.up.railway.app`. Admin login created;
schema imported with the 5 seed case studies. `work-list.js`'s `API_BASE`
already points at it. Steps below are for reference / redeploying from
scratch.

This powers the public `/api/work` endpoint (read by the static
[/work](../work/index.html) page hosted on Hostinger) and the `/admin`
panel. The admin adds, reorders, and hides work items from the panel -
changes show up on the live page immediately, no code change or redeploy
needed.

Split hosting: this `server/` folder deploys to **Railway** (Node process +
MySQL). Everything else in the repo (the marketing site, including
`/work`) stays static on **Hostinger** and talks to Railway over the
network.

## 1. Deploy to Railway

1. Log in to Railway (`railway login` if using the CLI, or via
   railway.app).
2. Create a new project, add a **MySQL** database to it (Railway
   provisions one and sets `MYSQL_URL`, `MYSQLHOST`, `MYSQLPORT`,
   `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` automatically).
3. Add a second service for this app, pointing its **root directory** at
   `server/` in this repo (Railway builds it with `npm install` and runs
   `npm start`).
4. Set these Variables on the app service:
   - `SESSION_SECRET` - a long random string. Generate one with:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `ALLOWED_ORIGINS` - `https://life180labs.com` (add more,
     comma-separated, if you test from other origins)
   - `NODE_ENV` - `production`
   - The `MYSQL*` variables are already set automatically once the MySQL
     plugin is attached to the same project - no need to copy them by hand.
5. Generate a public domain for the app service (Railway -> Settings ->
   Networking -> Generate Domain). Note the URL, e.g.
   `https://l180-work-backend-production.up.railway.app`.

## 2. Import the schema

Run `db/schema.sql` against the Railway MySQL database once. Easiest way:
`railway connect mysql` (opens a `mysql` shell against it) then
`source db/schema.sql`, or use the "Data" tab in the Railway dashboard's
MySQL service to run the file. This creates `admin_users`, `work_items`
(seeded with the five existing case studies), and `sessions`.

## 3. Create your admin login

From your machine, with the Railway CLI linked to this project:

```bash
cd server
railway run npm run create-admin -- yourusername "a-strong-password"
```

This runs the script with Railway's environment injected for that one
command, so it talks to the real production database without you ever
putting real credentials in a local `.env`. Re-run it any time to reset the
password.

## 4. Point the static site at the backend

In [`assets/js/components/work-list.js`](../assets/js/components/work-list.js),
update the `API_BASE` constant at the top to the Railway domain from step 1:

```js
const API_BASE = 'https://l180-work-backend-production.up.railway.app';
```

Then deploy the static site (including this change) to Hostinger as usual.

## 5. Log in

Go to `https://<your-railway-domain>/admin/login.html` and sign in. From
the dashboard you can:

- **Add new work** - title, description, highlights, metrics, pick one of
  five card artworks, optional link.
- **Reorder** - the up/down arrows on each row.
- **Show/hide** - the toggle switch; hidden items stay saved but drop off
  the live `/work` page.
- **Edit / delete** - via the row actions.

Everything writes straight to MySQL and is live on `/work` within a page
refresh (client-side fetch, no caching in front of it).

## Local development

```bash
cd server
cp .env.example .env   # fill in a local MySQL, or point MYSQL_URL at Railway's
npm install
npm run dev
```

The server serves the admin panel at `http://localhost:3000/admin/` and the
API at `http://localhost:3000/api/work`. Point `work-list.js`'s `API_BASE`
at `http://localhost:3000` temporarily while testing locally (Hostinger
doesn't need to be involved - you can open `work/index.html` directly from
disk since the API call is what needs a live target, not the page itself).

## Notes

- Single admin login by design - this is an internal tool for the site
  owner, not a multi-user CMS.
- No image upload: card art is one of five pre-built SVG motifs
  (honeycomb / AI orbit / color grid / shield / network), chosen from a
  dropdown. Keeps the panel simple and avoids file-upload security surface.
- Sessions are stored in MySQL (`sessions` table via `express-mysql-session`)
  so logins survive a Railway redeploy/restart.
- `GET /api/work` is CORS-enabled only for the origins listed in
  `ALLOWED_ORIGINS` - the admin API is same-origin only (served alongside
  the admin panel), so it needs no CORS configuration at all.
