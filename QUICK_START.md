# Quick Start for Deployment

## 1. Prepare Your Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Fill in your actual values in `.env`

## 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Copy the output and set it as your `NEXTAUTH_SECRET`

## 3. Set Up PostgreSQL Database

Choose a provider and get your connection string:
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres/quickstart
- **Supabase**: https://supabase.com/docs/guides/database
- **Neon**: https://neon.tech/docs/get-started-with-neon/signing-up

Update `DATABASE_URL` in your `.env` file

## 4. Update Prisma Schema

Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

## 5. Run Migrations

```bash
npx prisma migrate dev --name init
```

## 6. Test Locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to verify everything works

## 7. Deploy

### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### For Netlify:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Follow the prompts and add environment variables in the dashboard
```

## 8. Configure Services

After deployment, update these URLs:

- **NEXTAUTH_URL**: Set to your deployment URL (e.g., https://your-app.vercel.app)
- **Razorpay Webhook**: Add your deployment URL + `/api/checkout/webhook`
- **UploadThing**: Add your deployment URL to allowed origins

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.
