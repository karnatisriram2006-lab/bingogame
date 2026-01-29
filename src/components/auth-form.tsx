'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInAsGuest } = useAuth();

  const handleGuestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) return;
    setLoading(true);
    await signInAsGuest(username);
    onAuthSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleGuestSignIn} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Enter a Guest Name</Label>
        <Input
          id="username"
          placeholder="CoolCat123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button disabled={loading || username.trim().length < 3} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Play as Guest
      </Button>
    </form>
  );
}
