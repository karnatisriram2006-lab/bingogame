'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import type { ChatMessage } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ChatProps {
    roomId: string;
    messages: ChatMessage[];
}

export function Chat({ roomId, messages }: ChatProps) {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTo({ top: scrollViewport.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        const newMessage = {
            id: `${Date.now()}-${user.uid}`,
            senderId: user.uid,
            senderName: user.displayName || 'Guest',
            text: message.trim(),
            timestamp: serverTimestamp(),
        };

        try {
            const roomRef = doc(db, 'rooms', roomId);
            await updateDoc(roomRef, {
                messages: arrayUnion(newMessage)
            });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-bold mb-4">Chat</h3>
            <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4 text-sm">
                {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.senderName}`} />
                        <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <p className="font-semibold">{msg.senderName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {msg.timestamp?.toDate ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                </p>
                            </div>
                        <p className="text-muted-foreground break-words">{msg.text}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-muted-foreground text-center p-4">No messages yet. Say hello!</div>
                )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSend} className="flex gap-2">
                <Input
                placeholder="Say something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!user}
                />
                <Button type="submit" size="icon" disabled={!user || !message.trim()}>
                <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
