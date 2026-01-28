'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917Z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691Z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.618-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44Z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24c0-1.341-.138-2.65-.389-3.917Z" />
    </svg>
);


interface AuthFormProps {
  onAuthSuccess: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState<'guest' | 'google' | null>(null);
  const { signInAsGuest, signInWithGoogle } = useAuth();

  const handleGuestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) return;
    setLoading('guest');
    await signInAsGuest(username);
    onAuthSuccess();
    setLoading(null);
  };

  const handleGoogleSignIn = async () => {
    setLoading('google');
    await signInWithGoogle();
    // onAuthSuccess will be called via the auth state listener
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleGuestSignIn}>
        <div className="grid gap-2">
          <Label htmlFor="username">Guest Name</Label>
          <Input
            id="username"
            placeholder="CoolCat123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!loading}
          />
          <Button disabled={!!loading || username.trim().length < 3} className="mt-2">
            {loading === 'guest' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Play as Guest
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={!!loading} onClick={handleGoogleSignIn}>
        {loading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Google
      </Button>
    </div>
  );
}
