# Central Placement Cell - Authentication System

This project implements a Google OAuth authentication system with domain restriction and role-based access control for a college placement management system, integrated with Firebase for user data management.

## Features

- **Google OAuth**: Secure authentication using Google accounts
- **Domain Restriction**: Only allows users with @college.edu email addresses
- **Role Assignment**: Automatically assigns "admin" or "student" roles based on email
- **Protected Routes**: Middleware that enforces role-based access control
- **Clean UI**: Minimal, responsive login page
- **Reusable Navbar**: With logout functionality
- **Role-Based Dashboards**: Separate interfaces for admins and students
- **Firebase Integration**: User data stored in Firestore
- **Profile Management**: Students can update academic information

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=https://your-project.firebaseapp.com  # Update with your Firebase URL for production
NEXTAUTH_SECRET=your_nextauth_secret_here

# Firebase (get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 3. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create credentials (OAuth 2.0 Client IDs)
5. Set authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-project.firebaseapp.com/api/auth/callback/google`
6. Add your domain to "Authorized domains"

### 4. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > General to get your configuration values
5. Add the configuration values to your environment variables
6. Upload the security rules from `firebase/firestore.rules` to your Firebase project

### 5. Configure Domain and Admin Emails

In [auth.ts](./auth.ts), update the domain and admin emails:

```typescript
const ALLOWED_DOMAIN = "college.edu"; // Change to your college domain
const ADMIN_EMAILS = ["tpo@college.edu", "hod.cs@college.edu"]; // Add your admin emails
```

## How It Works

### Authentication Flow

1. User clicks "Continue with Google" on the login page
2. NextAuth redirects to Google for authentication
3. After successful Google authentication, the `signIn` callback:
   - Checks if the user's email ends with the allowed domain
   - Creates/updates user document in Firestore
   - If not, rejects the sign-in
4. The `jwt` callback assigns roles based on email:
   - Admin emails get "admin" role
   - All other allowed emails get "student" role
5. The `session` callback passes the role to the client

### Firestore Integration

- On first login, a user document is created in `users/{email}`
- For subsequent logins, the `lastLogin` timestamp is updated
- Student profiles include academic information (branch, CGPA, placement status)

### Role-Based Access Control

- **Admins** (defined in ADMIN_EMAILS) get access to `/admin` routes
- **Students** get access to `/dashboard` and `/profile/edit` routes
- Middleware in [middleware.ts](./middleware.ts) enforces these rules

### File Structure

```
├── auth.ts                 # NextAuth configuration with Firebase integration
├── middleware.ts           # Route protection
├── lib/firebase.ts         # Firebase configuration
├── firebase.json           # Firebase Hosting configuration
├── firebase/firestore.rules # Firestore security rules
├── components/
│   └── navbar.tsx         # Reusable navigation bar with logout
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # Auth API routes
│   ├── login/
│   │   ├── page.tsx       # Login page
│   │   └── google-button.tsx  # Google login button
│   ├── admin/page.tsx     # Admin dashboard
│   ├── dashboard/page.tsx # Student dashboard
│   ├── profile/edit/page.tsx # Student profile editor
│   └── page.tsx           # Root redirect
```

## Running the Application Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application locally.

## Deploying the Application

> [!IMPORTANT]
> **See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.**

This application is ready to deploy to:
- **Vercel** (Recommended) - Full Next.js support with automatic deployments
- **Firebase Hosting** - Static hosting with Firebase Functions for API routes

### Quick Start

**For Vercel:**
```bash
vercel --prod
```

**For Firebase:**
```bash
npm run build
firebase deploy --only hosting
```

**Environment Variables Required:**
- All variables from `.env.example` must be configured in your deployment platform
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions


## Customization

### Changing the Domain

Update the `ALLOWED_DOMAIN` constant in [auth.ts](./auth.ts).

### Adding Admin Emails

Add to the `ADMIN_EMAILS` array in [auth.ts](./auth.ts).

### Modifying UI

- Login page: [app/login/page.tsx](./app/login/page.tsx)
- Google button: [app/login/google-button.tsx](./app/login/google-button.tsx)
- Admin dashboard: [app/admin/page.tsx](./app/admin/page.tsx)
- Student dashboard: [app/dashboard/page.tsx](./app/dashboard/page.tsx)
- Navigation: [components/navbar.tsx](./components/navbar.tsx)
- Profile editor: [app/profile/edit/page.tsx](./app/profile/edit/page.tsx)

## Security Notes

> [!WARNING]
> **Never commit `.env.local` to Git!** All sensitive credentials are protected by `.gitignore`.

- ✅ All secrets are stored in environment variables
- ✅ `.gitignore` prevents committing sensitive files
- ✅ Domain restriction prevents unauthorized access
- ✅ Admin access is limited to specific email addresses
- ✅ Middleware provides robust route protection
- ✅ Defense-in-depth approach with both middleware and server-side checks
- ✅ Firebase security rules enforce data access control

**Environment Variable Security:**
- Use different OAuth credentials for development and production
- Rotate `NEXTAUTH_SECRET` periodically
- Never share `.env.local` file
- Review `.env.example` for required variables

For deployment security guidelines, see [DEPLOYMENT.md](./DEPLOYMENT.md).
# CPCHackvento
