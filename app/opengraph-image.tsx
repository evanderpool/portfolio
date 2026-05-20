import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Erick Vanderpool — Full-Stack Engineer & Content Creator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#F5EFE6',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Terracotta accent stripe — top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#C8553D',
          }}
        />

        {/* Content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px',
            width: '100%',
          }}
        >
          {/* Monogram */}
          <div
            style={{
              fontSize: '32px',
              color: '#C8553D',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}
          >
            EV
          </div>

          {/* Main title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: '72px',
                color: '#1A1612',
                fontStyle: 'italic',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
              }}
            >
              Erick Vanderpool
            </div>
            <div
              style={{
                fontSize: '28px',
                color: '#4A5D49',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            >
              Full-Stack Engineer &amp; Content Creator
            </div>
          </div>

          {/* Footer line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{ width: '48px', height: '1px', background: '#B89B5E', opacity: 0.5 }}
            />
            <div
              style={{ fontSize: '14px', color: '#B89B5E', letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              Databases · Web Dev · Content Systems
            </div>
          </div>
        </div>

        {/* Terracotta accent stripe — right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '6px',
            background: '#C8553D',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
