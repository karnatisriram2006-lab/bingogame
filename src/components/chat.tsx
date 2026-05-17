'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { ChatMessage } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

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
            timestamp: new Date(),
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
        <div className="flex h-full min-h-0 flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-bold">Chat</h3>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                    {messages?.length || 0}
                </span>
            </div>
            <ScrollArea className="mb-4 flex-1 pr-3" ref={scrollAreaRef}>
                <div className="space-y-4 text-sm">
                {messages && messages.length > 0 ? (
                    messages.map((msg) => {
                    const isMine = msg.senderId === user?.uid;

                    return (
                    <div key={msg.id} className={cn("flex items-start gap-3", isMine && "flex-row-reverse")}>
                        <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.senderName}`} />
                        <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={cn("min-w-0 flex-1", isMine && "text-right")}>
                            <div className={cn("flex items-baseline gap-2", isMine && "justify-end")}>
                                <p className="font-semibold">{msg.senderName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {msg.timestamp?.toDate ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                </p>
                            </div>
                        <p
                            className={cn(
                                "mt-1 inline-block max-w-full rounded-lg px-3 py-2 text-left leading-relaxed shadow-sm [overflow-wrap:anywhere]",
                                isMine
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/70 text-secondary-foreground"
                            )}
                        >
                            {msg.text}
                        </p>
                        </div>
                    </div>
                    );
                    })
                ) : (
                    <div className="rounded-lg border border-dashed bg-background/60 p-4 text-center text-muted-foreground">No messages yet. Say hello!</div>
                )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSend} className="flex gap-2">
                <Input
                placeholder="Say something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!user}
                className="h-11"
                />
                <Button type="submit" size="icon" className="h-11 w-11" disabled={!user || !message.trim()}>
                <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
