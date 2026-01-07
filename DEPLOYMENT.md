# Deployment Guide

This guide covers deploying your Next.js application to both **Vercel** and **Firebase Hosting**.

## Prerequisites

Before deploying, ensure you have:

1. **Firebase Project** - Already configured (anadi-4b750)
2. **Google OAuth Credentials** - From [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. **Git Repository** - Code pushed to GitHub/GitLab/Bitbucket
4. **Node.js** - Version 18+ installed locally

---

## Environment Variables Setup

### Required Environment Variables

All platforms need these environment variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD537f1jywmEWebrQaaEtfnhF-NAwpbWYc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=anadi-4b750.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=anadi-4b750
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=anadi-4b750.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=244230100202
NEXT_PUBLIC_FIREBASE_APP_ID=1:244230100202:web:658415c8fbd15f6194b393
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9XZGE7C023

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://your-domain.com
```

---

## Deploying to Vercel (Recommended)

Vercel is the easiest platform for Next.js deployment with automatic CI/CD.

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel auto-detects Next.js settings
5. **Add Environment Variables:**
   - Go to **Settings → Environment Variables**
   - Add all variables from `.env.example`
   - Set them for **Production**, **Preview**, and **Development**

### Step 3: Configure OAuth Redirect URIs

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

Add authorized redirect URIs:
```
https://your-app.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### Step 4: Deploy

```bash
# Option 1: Push to Git (auto-deploys)
git add .
git commit -m "Ready for deployment"
git push origin main

# Option 2: Deploy via CLI
vercel --prod
```

### Step 5: Update NEXTAUTH_URL

After deployment, update the `NEXTAUTH_URL` environment variable in Vercel:
```
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## Deploying to Firebase Hosting

Firebase Hosting is ideal if you want everything in one Firebase ecosystem.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase (Already Done)

Your project is already configured. Verify with:
```bash
firebase projects:list
```

### Step 4: Build the Application

```bash
npm run build
```

### Step 5: Deploy to Firebase

```bash
firebase deploy --only hosting
```

### Step 6: Configure Environment Variables

> [!IMPORTANT]
> Firebase Hosting serves static files only. For server-side features (NextAuth), you need **Firebase Functions** or use Vercel instead.

If using Firebase Functions for API routes:

1. Create `.env` file in `functions/` directory
2. Add non-public variables (GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET)
3. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

---

## Google OAuth Setup

### Step 1: Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create new one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-vercel-app.vercel.app/api/auth/callback/google
   https://your-firebase-app.web.app/api/auth/callback/google
   ```

### Step 2: Copy Credentials

Copy the **Client ID** and **Client Secret** to your environment variables.

---

## Generate NextAuth Secret

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` environment variable.

---

## Verification Checklist

After deployment, verify:

- [ ] Application loads without errors
- [ ] Google OAuth login works
- [ ] Firebase Firestore reads/writes work
- [ ] Environment variables are not exposed in browser console
- [ ] `.env.local` is not committed to Git
- [ ] All API routes return expected responses

---

## Troubleshooting

### Issue: "NEXTAUTH_URL is not defined"

**Solution:** Add `NEXTAUTH_URL` to your environment variables with your production URL.

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution:** Verify all `NEXT_PUBLIC_FIREBASE_*` variables are correctly set.

### Issue: OAuth redirect URI mismatch

**Solution:** Ensure redirect URIs in Google Cloud Console match your deployment URLs exactly.

### Issue: Build fails on Vercel

**Solution:** Check build logs. Common issues:
- Missing environment variables
- TypeScript errors
- Dependency issues

---

## Security Best Practices

> [!WARNING]
> **Never commit `.env.local` to Git!**

✅ **Do:**
- Use environment variables for all secrets
- Keep `.env.example` updated
- Use different OAuth credentials for dev/prod
- Rotate secrets periodically

❌ **Don't:**
- Hardcode API keys in source code
- Commit `.env.local` or `.env.production`
- Share secrets in public repositories
- Use the same secrets across environments

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Support

For issues specific to:
- **Vercel:** [Vercel Support](https://vercel.com/support)
- **Firebase:** [Firebase Support](https://firebase.google.com/support)
- **NextAuth:** [NextAuth Discussions](https://github.com/nextauthjs/next-auth/discussions)
