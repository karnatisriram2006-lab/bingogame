# **App Name**: BingoGameGuys

## Core Features:

- Homepage: Display a clean landing page with options to create or join a Bingo room.
- Authentication: Allow users to authenticate via guest mode or Google login. Store user profiles in Firestore.
- Create Room: Enable hosts to create a room with customizable options (grid size, game type, win condition) and generate a shareable room code.
- Join Room: Allow players to join a room using a room code and display a lobby with player list and host controls.
- Bingo Game Screen: Implement the main Bingo game screen with a Bingo card, called numbers history, players list, and chat functionality.
- Caller System (Host): Provide host controls to call the next number or word using a random draw system, with an option for an auto-call timer.
- Bingo Claim Validation: Allow players to claim Bingo, automatically verify the claim against server-side rules, and reward the winner with a celebratory animation.

## Style Guidelines:

- Primary color: Vibrant purple (#9400D3) to evoke excitement and modernity.
- Background color: Light purple (#F0E6FF), a desaturated version of the primary color, for a calm backdrop.
- Accent color: Electric blue (#7DF9FF), an analogous color that's high in contrast, for interactive elements and highlights.
- Body and headline font: 'Inter', a sans-serif font offering a modern and clean appearance.
- Use modern and playful icons to represent different game actions and features.
- Implement a responsive layout that adapts to different screen sizes (mobile and desktop).
- Add subtle animations (Framer Motion) to enhance user experience and provide feedback during game actions.