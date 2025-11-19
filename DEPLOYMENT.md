# Deployment Guide

This guide covers deploying your Next.js e-commerce app to Vercel or Netlify.

## Important: Database Considerations

⚠️ **SQLite is not suitable for production deployments on Vercel/Netlify** because:
- These platforms use ephemeral file systems (files are deleted after each deployment)
- Your database will be reset on every deployment
- Multiple instances can't share the same database file

### Recommended Solution: Switch to PostgreSQL

Before deploying, you should migrate from SQLite to PostgreSQL:

1. **Get a PostgreSQL database** (choose one):
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (free tier available)
   - [Supabase](https://supabase.com/) (free tier available)
   - [Neon](https://neon.tech/) (free tier available)
   - [Railway](https://railway.app/) (free tier available)

2. **Update your Prisma schema** (`prisma/schema.prisma`):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update your DATABASE_URL** to use PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

## Deploy to Vercel (Recommended)

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free)
- PostgreSQL database (see above)

### Steps

1. **Push your code to Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   Add these in Vercel dashboard (Settings → Environment Variables):
   ```
   DATABASE_URL=<your-postgresql-connection-string>
   NEXTAUTH_URL=<your-vercel-url>
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   UPLOADTHING_SECRET=<your-uploadthing-secret>
   UPLOADTHING_APP_ID=<your-uploadthing-app-id>
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

5. **Run Database Migrations** (first deployment only):
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Link project: `vercel link`
   - Run migration: `vercel env pull .env.local && npx prisma migrate deploy`

## Deploy to Netlify

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Netlify account (free)
- PostgreSQL database (see above)

### Steps

1. **Install Netlify Next.js plugin**:
   ```bash
   npm install -D @netlify/plugin-nextjs
   ```

2. **Push your code to Git** (same as Vercel step 1)

3. **Import to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build settings are auto-configured from `netlify.toml`

4. **Configure Environment Variables**:
   Add these in Netlify dashboard (Site settings → Environment variables):
   ```
   DATABASE_URL=<your-postgresql-connection-string>
   NEXTAUTH_URL=<your-netlify-url>
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   UPLOADTHING_SECRET=<your-uploadthing-secret>
   UPLOADTHING_APP_ID=<your-uploadthing-app-id>
   ```

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy automatically

6. **Run Database Migrations** (first deployment only):
   - Install Netlify CLI: `npm i -g netlify-cli`
   - Login: `netlify login`
   - Link site: `netlify link`
   - Run migration: `netlify env:import .env.local && npx prisma migrate deploy`

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test product browsing and cart functionality
- [ ] Test payment flow with Razorpay test mode
- [ ] Test file uploads with UploadThing
- [ ] Verify admin panel access
- [ ] Check all API routes are working
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Set up monitoring and error tracking (optional: Sentry, LogRocket)

## Troubleshooting

### Build Fails
- Check build logs for specific errors
- Ensure all environment variables are set
- Verify Prisma schema is valid
- Make sure `prisma generate` runs before build

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database allows connections from deployment platform IPs
- Ensure SSL is configured if required by your database provider

### Authentication Issues
- Verify NEXTAUTH_URL matches your deployment URL
- Ensure NEXTAUTH_SECRET is set and secure
- Check callback URLs in your OAuth providers (if using)

### Payment Issues
- Verify Razorpay credentials are correct
- Check webhook URLs are configured in Razorpay dashboard
- Test with Razorpay test mode first

## Continuous Deployment

Both Vercel and Netlify automatically redeploy when you push to your Git repository:

```bash
git add .
git commit -m "Your changes"
git push
```

Your site will automatically rebuild and deploy!
