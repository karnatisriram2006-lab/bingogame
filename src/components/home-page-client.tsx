'use client';

import { useState } from 'react';
import Image from 'next/image';
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
    <div className="flex flex-1 flex-col">
      <section className="w-full">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 py-12 md:grid-cols-2 md:py-24">
            <div className="flex flex-col items-start space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
                BingoGameGuys
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Play real-time multiplayer bingo online with friends.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" onClick={() => setCreateOpen(true)} className="shadow-lg shadow-primary/20">
                  <Ticket className="mr-2" /> Create a Room
                </Button>
                <Button size="lg" variant="secondary" onClick={() => setJoinOpen(true)}>
                  <Users className="mr-2" /> Join a Room
                </Button>
              </div>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-2xl md:h-96">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary/50 py-12 md:py-24">
        <div className="container mx-auto">
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
