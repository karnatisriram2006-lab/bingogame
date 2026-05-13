import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'BingoBlitz – Free Online Multiplayer Bingo Game';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(132,0,255,0.25) 0%, transparent 70%)',
          }}
        />

        {/* Logo / Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #8400FF, #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-2px',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          BingoBlitz
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#e2e8f0',
            marginBottom: 48,
            display: 'flex',
          }}
        >
          Free Online Multiplayer Bingo
        </div>

        {/* Bingo Card Grid */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 48,
          }}
        >
          {[
            ['B', 'I', 'N', 'G', 'O'],
            [7, 22, 35, 48, 63],
            [14, 29, '★', 55, 70],
            [3, 18, 42, 59, 75],
            [11, 25, 38, 52, 68],
          ].map((row, ri) =>
            row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                style={{
                  width: 64,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  fontSize: ri === 0 ? 28 : 20,
                  fontWeight: ri === 0 ? 900 : 600,
                  background:
                    ri === 0
                      ? 'linear-gradient(135deg, #8400FF, #a855f7)'
                      : cell === '★'
                      ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                      : ri === 2
                      ? 'rgba(132,0,255,0.5)'
                      : 'rgba(255,255,255,0.07)',
                  color:
                    ri === 0 ? '#ffffff' : cell === '★' ? '#0a0a0a' : '#e2e8f0',
                  border:
                    ri === 2 && cell !== '★'
                      ? '2px solid rgba(132,0,255,0.8)'
                      : '2px solid rgba(255,255,255,0.1)',
                }}
              >
                {cell}
              </div>
            ))
          )}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#a78bfa',
            letterSpacing: 2,
            display: 'flex',
          }}
        >
          Create Room · Invite Friends · Shout BINGO!
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 48,
            fontSize: 18,
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
          }}
        >
          bingogameguys.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
