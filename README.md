# BingoGameGuys

This is a Next.js application for playing Bingo online with friends, built with Firebase.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You will also need to create a `.env.local` file in the root of the project and add your Firebase project credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Deploying to Vercel

This project is ready to be deployed on [Vercel](https://vercel.com/).

### 1. Connect to Vercel

*   Sign up for a free Vercel account.
*   Connect your Git repository (e.g., from GitHub) where your project code is stored. Vercel will automatically detect that it's a Next.js project.

### 2. Configure Environment Variables

This is the most important step. You need to provide Vercel with your Firebase project credentials.

In your Vercel project settings, navigate to **Settings > Environment Variables** and add the following, using the same values from your `.env.local` file:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`


### 3. Deploy

Once the environment variables are set, trigger a deployment from your Vercel dashboard. Pushing a new commit to your main branch will also trigger a deployment automatically.

Vercel will build and deploy your application, providing you with a public URL.