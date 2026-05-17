'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HowToPlay } from '@/components/how-to-play';
import { CreateRoomForm } from '@/components/create-room-form';
import { JoinRoomForm } from '@/components/join-room-form';
import { Ticket, Users } from 'lucide-react';

export function HomePageClient() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'bingo-hero');

  return (
    <div className="flex flex-1 flex-col relative overflow-hidden">
      <section className="w-full relative">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 py-20 md:grid-cols-2 md:py-32">
            <div className="flex flex-col items-start space-y-8 relative z-20">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md">
                  ✨ The ultimate multiplayer experience
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl font-headline bg-gradient-to-br from-foreground via-foreground to-muted-foreground text-transparent bg-clip-text drop-shadow-sm leading-[1.1]">
                  BingoGameGuys
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Create a room, invite friends, and play real-time bingo in your browser. No downloads, no fuss — just shout BINGO together.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row">
                <Button size="lg" onClick={() => setCreateOpen(true)} className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
                  <Ticket className="mr-2 h-5 w-5" /> Create a Room
                </Button>
                <Button size="lg" variant="secondary" onClick={() => setJoinOpen(true)} className="h-14 px-8 text-lg rounded-2xl border border-white/10 bg-secondary/50 backdrop-blur-md hover:bg-secondary hover:scale-105 transition-all duration-300">
                  <Users className="mr-2 h-5 w-5" /> Join a Room
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                  Free to play
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                  Works on mobile
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                  Real-time rooms
                </span>
              </div>
              <div>
                <Link
                  href="#how-to-play"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Learn how it works
                </Link>
              </div>
            </div>
            
            <div className="relative h-80 w-full overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 md:h-[500px] group">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImage.imageHint}
                  priority
                  className="transition-transform duration-1000 group-hover:scale-105"
                />
              )}
               <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/20 to-transparent pointer-events-none" />
               <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-to-play"
        className="w-full relative bg-secondary/30 backdrop-blur-xl border-y border-white/5 py-16 md:py-32 scroll-mt-20"
      >
        <div className="container mx-auto px-4 relative z-10">
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
