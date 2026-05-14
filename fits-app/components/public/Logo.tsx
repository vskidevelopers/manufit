'use client';

export default function Logo() {
  return (
    <div className="flex items-center justify-center bg-black p-8 rounded-2xl w-full h-full">
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md"
      >
        {/* Main D Shape */}
        <path
          d="M170 90H285C365 90 420 145 420 225C420 305 365 360 285 360H170V90Z"
          fill="#12A8FF"
        />

        {/* Inner Cut */}
        <path
          d="M225 145H285C335 145 370 180 370 225C370 270 335 305 285 305H225V145Z"
          fill="black"
        />

        {/* Left Vertical Cut */}
        <rect x="170" y="145" width="40" height="160" fill="black" />

        {/* Orange Accent */}
        <path
          d="M170 135L205 100V160L170 190V135Z"
          fill="#FFB000"
        />

        {/* Text */}
        <g transform="translate(55, 400)">
          {/* i */}
          <circle cx="10" cy="-20" r="7" fill="#FFB000" />
          <rect x="4" y="0" width="12" height="50" rx="6" fill="#FFB000" />

          {/* dash */}
          <rect x="40" y="20" width="35" height="10" rx="5" fill="#FFB000" />

          {/* D */}
          <path
            d="M110 0H155C185 0 205 20 205 50C205 80 185 100 155 100H110V0Z"
            fill="#FFB000"
          />
          <path
            d="M135 20H155C170 20 180 30 180 50C180 70 170 80 155 80H135V20Z"
            fill="black"
          />

          {/* R */}
          <path
            d="M235 0H290C315 0 330 15 330 35C330 50 320 62 305 67L330 100H300L280 75H260V100H235V0ZM260 20V55H285C295 55 305 48 305 38C305 28 295 20 285 20H260Z"
            fill="#FFB000"
          />

          {/* Blue Dot */}
          <circle cx="355" cy="70" r="6" fill="#12A8FF" />

          {/* P */}
          <path
            d="M390 0H445C470 0 485 18 485 40C485 62 470 80 445 80H415V100H390V0ZM415 20V60H440C450 60 460 52 460 40C460 28 450 20 440 20H415Z"
            fill="#FFB000"
          />
        </g>
      </svg>
    </div>
  );
}
