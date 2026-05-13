import { Users, Ticket, CheckCircle, Trophy } from 'lucide-react';

export function HowToPlay() {
  const steps = [
    {
      icon: Users,
      title: 'Step 1: Create or Join',
      description: 'Create a new room as host or join with a code. Play as a guest or sign in with Google.',
    },
    {
      icon: Ticket,
      title: 'Step 2: Get Your Card',
      description: 'Wait for the host to start. A unique bingo card will be generated for you automatically.',
    },
    {
      icon: CheckCircle,
      title: 'Step 3: Mark Your Card',
      description: 'Listen for the called items. Click your card to mark matches as they are called.',
    },
    {
      icon: Trophy,
      title: 'Step 4: Shout BINGO!',
      description: 'Complete the pattern and hit BINGO! If verified, you win the round!',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How to Play</h2>
        <p className="mt-4 text-muted-foreground">Four simple steps to start your bingo journey.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center text-center">
            {index < steps.length - 1 && (
              <div className="absolute left-[60%] top-8 hidden w-full border-t-2 border-dashed border-muted lg:block" />
            )}
            <div className="z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <step.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
