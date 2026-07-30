# BCU Group backend and deployment

## Local setup

1. Create a PostgreSQL database and copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and `DIRECT_URL`. Generate `AUTH_SECRET` with `openssl rand -base64 32`.
3. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique password of at least 12 characters.
4. Run `npm install`, `npm run db:generate`, `npm run db:migrate -- --name initial`, and `npm run db:seed`.
5. Run `npm run dev` and sign in at `/admin/login`.

The seed is idempotent. It imports the existing companies, projects, news and careers and creates or updates the initial super administrator.

## Vercel

1. Import the repository into Vercel and select the Next.js preset.
2. Provision PostgreSQL, set every required environment variable from `.env.example`, and use pooled and direct URLs where the provider offers both.
3. Configure S3-compatible storage and set `STORAGE_PROVIDER=s3`; Vercel's filesystem is not durable.
4. Run `npm run db:deploy` and `npm run db:seed` against production from a secure deployment job.
5. Deploy with `npm run build`. The `postinstall` script generates Prisma Client.

For later schema changes, create a reviewed migration locally with `npm run db:migrate -- --name <change>`, commit it, then run `npm run db:deploy` in production.

To recover admin access, set secure `ADMIN_*` values and rerun `npm run db:seed`. Never expose database, S3, email, or admin secrets through `NEXT_PUBLIC_*`.
