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
      <section className="relative min-h-[calc(100svh-10rem)] w-full overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            data-ai-hint={heroImage.imageHint}
            priority
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/64 to-slate-950/22" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] items-center px-4 py-12 sm:py-16">
            <div className="flex max-w-2xl flex-col items-start space-y-7 text-white">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                  ✨ The ultimate multiplayer experience
                </div>
                <h1 className="text-4xl font-extrabold tracking-normal sm:text-6xl md:text-7xl font-headline drop-shadow-sm leading-[1.05]">
                  BingoGameGuys
                </h1>
                <p className="max-w-[600px] text-white/84 text-lg md:text-xl leading-relaxed">
                  Create a room, invite friends, and play real-time bingo in your browser. No downloads, no fuss — just shout BINGO together.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row">
                <Button size="lg" onClick={() => setCreateOpen(true)} className="h-14 px-8 text-lg rounded-lg shadow-xl shadow-primary/25 hover:shadow-primary/40">
                  <Ticket className="mr-2 h-5 w-5" /> Create a Room
                </Button>
                <Button size="lg" variant="secondary" onClick={() => setJoinOpen(true)} className="h-14 px-8 text-lg rounded-lg border border-white/20 bg-white/90 text-foreground backdrop-blur-md hover:bg-white">
                  <Users className="mr-2 h-5 w-5" /> Join a Room
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Free to play
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Works on mobile
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Real-time rooms
                </span>
              </div>
              <div>
                <Link
                  href="#how-to-play"
                  className="text-sm font-medium text-white underline-offset-4 hover:underline"
                >
                  Learn how it works
                </Link>
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

      {!isCreateOpen && !isJoinOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden pb-safe">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="relative pointer-events-auto border-t border-border/60 bg-background/85 backdrop-blur px-4 py-3">
            <div className="mx-auto flex max-w-md gap-3">
              <Button
                size="lg"
                onClick={() => setCreateOpen(true)}
                className="h-12 flex-1 rounded-lg shadow-lg shadow-primary/20"
              >
                <Ticket className="mr-2 h-5 w-5" /> Create
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setJoinOpen(true)}
                className="h-12 flex-1 rounded-lg border bg-secondary/60 backdrop-blur"
              >
                <Users className="mr-2 h-5 w-5" /> Join
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
