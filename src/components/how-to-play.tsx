import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Ticket, CheckCircle, Trophy } from 'lucide-react';

export function HowToPlay() {
  return (
    <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8">How to Play</h2>
        <Accordion type="single" collapsible className="w-full text-left">
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg"><Users className="h-5 w-5" /></div>
                Step 1: Create or Join a Room
            </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
            Choose to create a new room as the host or join an existing room using a unique room code provided by a friend. You can play as a guest or sign in with your Google account.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg"><Ticket className="h-5 w-5" /></div>
                Step 2: Get Your Bingo Card
            </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
            Once in the lobby, wait for the host to start the game. A unique bingo card will be automatically generated for you based on the room's settings (e.g., numbers or words).
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg"><CheckCircle className="h-5 w-5" /></div>
                Step 3: Mark Your Card
            </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
            Listen for the numbers or words called by the host. If the called item is on your card, click or tap to mark the cell. The system will also auto-highlight matches for you!
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg"><Trophy className="h-5 w-5" /></div>
                    Step 4: Shout BINGO!
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
            When you complete the win condition (like getting one line), hit the "BINGO!" button. If the condition is "Full House," it means you need to mark every single square on your card. The system will verify your win and crown you the champion!
            </AccordionContent>
        </AccordionItem>
        </Accordion>
    </div>
  );
}
