'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send } from 'lucide-react';

// This is a placeholder component for chat functionality.
// Full implementation would require wiring up to Firestore.

export function Chat() {
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    // In a real implementation, you would add the message to Firestore here.
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full rounded-lg bg-card p-4 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Chat</h3>
      <ScrollArea className="flex-1 mb-4 pr-4">
        <div className="space-y-4 text-sm">
          {/* Messages would be rendered here */}
          <div className="text-muted-foreground text-center p-4">Chat is not yet implemented.</div>
        </div>
      </ScrollArea>
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          placeholder="Say something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled
        />
        <Button type="submit" size="icon" disabled>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
