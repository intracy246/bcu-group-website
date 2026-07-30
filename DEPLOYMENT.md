# Deployment

Use Node.js 20 LTS or newer and a supported PostgreSQL release. Keep `.env` outside source control. `DATABASE_URL` may be pooled; `DIRECT_URL` must support migrations. Generate `AUTH_SECRET` from at least 32 random bytes.

## Self-hosted Node.js

Install into a versioned release directory, then run:

```bash
npm ci
npm run db:generate
npm run db:deploy
npm run db:seed
npm run build
npm run start
```

Use `ecosystem.config.cjs` with PM2 (`pm2 start ecosystem.config.cjs`, `pm2 save`, and `pm2 startup`). Put environment values in the service environment or an unreadable-by-others `.env`; the PM2 file contains no secrets. Proxy `127.0.0.1:3000` through Nginx, enable HTTPS with Certbot, expose only ports 22 (restricted), 80, and 443, and do not expose PostgreSQL publicly.

For local storage, set `STORAGE_PROVIDER=local` and `LOCAL_STORAGE_PATH` to an absolute persistent directory owned by the app user. Back up that directory with the database. For S3-compatible storage, set `STORAGE_PROVIDER=s3` plus `S3_ENDPOINT` (optional for AWS), `S3_REGION`, `S3_BUCKET`, credentials, and `S3_PUBLIC_URL`. The bucket should deny public listing; only the `public/` prefix should be served through the configured public endpoint. CVs use `private/` keys and the authenticated application route.

Monitor PM2/Nginx logs and `GET /api/health`. The endpoint reports only application/database availability. Configure alerts for non-200 responses, disk capacity, database connections, and backup failures.

## Vercel

Connect the repository using the Next.js preset and set all production environment variables in Vercel. Use durable production PostgreSQL and `STORAGE_PROVIDER=s3`; Vercel filesystem storage is ephemeral. The build command is `npm run build`; `postinstall` generates Prisma Client. Run `npm run db:deploy` from a controlled deployment job before promoting the release, and seed only when the idempotent baseline data is required. Configure the custom domain and set both `NEXT_PUBLIC_SITE_URL` and the database-backed public website URL to its HTTPS origin.

## Backup, migration, and rollback

- Take automated encrypted PostgreSQL backups, periodically test restore, and retain point-in-time recovery where available.
- Back up local media with matching retention; for S3 enable versioning and lifecycle policies.
- Create migrations locally with `npm run db:migrate -- --name <change>`, review and commit them, then use `npm run db:deploy` in production. Never use `prisma db push` in production.
- Before deployment, snapshot the database and retain the previous release directory/container and build artifact.
- On application failure, route traffic to the previous release and restart it. Prisma migrations are forward-only by default: restore the database snapshot or apply a separately reviewed corrective migration rather than editing migration history.
- Rotate leaked credentials in the provider consoles and restart the application; never place secrets in `NEXT_PUBLIC_*`.
