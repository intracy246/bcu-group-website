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

Connect the repository using the Next.js preset and set all production environment variables in Vercel. Use durable production PostgreSQL and `STORAGE_PROVIDER=s3`; Vercel filesystem storage is ephemeral. The build command is `npm run build`; `postinstall` generates Prisma Client. Run `npm run db:deploy` from a controlled deployment job before promoting the release, and seed only when the idempotent baseline data is required. Configure the custom domain and set `NEXT_PUBLIC_SITE_URL=https://bcugroup.co.tz`. The environment variable takes precedence over the database-backed public URL so canonical metadata, sitemap, and robots use the same production origin.

### Google Analytics 4 and Search Console

- In Vercel, open **Project → Settings → Environment Variables** and add `NEXT_PUBLIC_GA_ID` with the GA4 web-stream measurement ID (format `G-XXXXXXXXXX`). Apply it to Production, then redeploy. Analytics stays inactive when this variable is blank or invalid.
- Add `GOOGLE_SITE_VERIFICATION` with the verification token from Search Console's **HTML tag** method (paste only the token value, not the full meta tag). Apply it to Production and redeploy. The app emits Google's verification metadata only when a token is configured.
- In Google Search Console, add the **Domain property** `bcugroup.co.tz` and complete its DNS TXT verification at the authoritative DNS provider. This verifies both the root domain and subdomains. Alternatively, use the URL-prefix property `https://bcugroup.co.tz/` and the HTML-tag method above.
- Once verified, open the property, go to **Sitemaps**, and submit `sitemap.xml`. Confirm that the discovered sitemap URL is `https://bcugroup.co.tz/sitemap.xml`; also inspect `https://bcugroup.co.tz/robots.txt`.
- Use **URL inspection** in Search Console for `https://bcugroup.co.tz/` and important public pages, then select **Request indexing**. Google decides whether and when to index pages; submission is not a guarantee of indexing.
- Never commit Analytics credentials, verification tokens, or other secrets. The GA measurement ID is designed to be public, but keep all API secrets private.

## Backup, migration, and rollback

- Take automated encrypted PostgreSQL backups, periodically test restore, and retain point-in-time recovery where available.
- Back up local media with matching retention; for S3 enable versioning and lifecycle policies.
- Create migrations locally with `npm run db:migrate -- --name <change>`, review and commit them, then use `npm run db:deploy` in production. Never use `prisma db push` in production.
- Before deployment, snapshot the database and retain the previous release directory/container and build artifact.
- On application failure, route traffic to the previous release and restart it. Prisma migrations are forward-only by default: restore the database snapshot or apply a separately reviewed corrective migration rather than editing migration history.
- Rotate leaked credentials in the provider consoles and restart the application; never place secrets in `NEXT_PUBLIC_*`.
