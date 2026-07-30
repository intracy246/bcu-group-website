# BCU Group website and CMS

Next.js 16, React 19, PostgreSQL, Prisma, strict TypeScript, server-side administrator sessions, and local/S3-compatible file storage.

## Local development

Use Node.js 20 LTS or newer. Copy `.env.example` to `.env` and provide your own PostgreSQL, authentication, initial administrator, and optional email values. Never commit `.env`.

```powershell
npm ci
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

The public website is at `/`; the protected CMS is at `/admin`. The seed is idempotent and static files under `src/data` are seed input only.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for self-hosted Node/PM2/Nginx and Vercel deployment, migrations, backups, storage, monitoring, and rollback.
