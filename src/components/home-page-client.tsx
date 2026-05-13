'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HowToPlay } from '@/components/how-to-play';
import { CreateRoomForm } from '@/components/create-room-form';
import { JoinRoomForm } from '@/components/join-room-form';
import { Ticket, Users, Zap, Settings, MessageSquare, Share2 } from 'lucide-react';

export function HomePageClient() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'bingo-hero');

  return (
    <div className="flex flex-1 flex-col">
      <section className="w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 py-12 md:grid-cols-2 md:py-24">
            <div className="flex flex-col items-start space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                New: Custom Word Bingo!
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Play Bingo with Friends Anywhere
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience the thrill of real-time bingo. Create a private room, customize your game, and invite your friends for an unforgettable game night.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
                <Button size="lg" onClick={() => setCreateOpen(true)} className="h-12 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  <Ticket className="mr-2 h-5 w-5" /> Create a Room
                </Button>
                <Button size="lg" variant="outline" onClick={() => setJoinOpen(true)} className="h-12 px-8 transition-all hover:bg-secondary">
                  <Users className="mr-2 h-5 w-5" /> Join a Room
                </Button>
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl md:aspect-square lg:aspect-video">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y bg-muted/30 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Game Features</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg">
              Everything you need for a perfect online bingo night.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Play</h3>
              <p className="text-sm text-muted-foreground">Synchronized calling and instant verification for everyone in the room.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Fully Customizable</h3>
              <p className="text-sm text-muted-foreground">Choose from numbers or your own custom word lists. Set the grid size and win conditions.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Shout BINGO and chat with your friends while you play.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Easy Sharing</h3>
              <p className="text-sm text-muted-foreground">Invite friends with a simple room code or a direct link. No app download required.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4">
          <HowToPlay />
        </div>
      </section>

      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Bingo Room</DialogTitle>
            <DialogDescription>Customize your game and invite friends to play.</DialogDescription>
          </DialogHeader>
          <CreateRoomForm onRoomCreated={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join a Room</DialogTitle>
            <DialogDescription>Enter a room code to join a game.</DialogDescription>
          </DialogHeader>
          <JoinRoomForm onRoomJoined={() => setJoinOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
