import React from "react";

const LogoIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      className="block"
      role="img"
      aria-label="EasyStay icon"
    >
      <defs>
        <linearGradient id="easystay-icon-roof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f7a8c" />
          <stop offset="100%" stopColor="#134e6f" />
        </linearGradient>
        <linearGradient id="easystay-icon-door" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d35e" />
          <stop offset="100%" stopColor="#f0b429" />
        </linearGradient>
      </defs>
      <path
        d="M17.9998 4.2L4.5 15.8333V32.25H11.625V23.6667H24.375V32.25H31.4998V15.8333L17.9998 4.2Z"
        fill="url(#easystay-icon-roof)"
        stroke="#0f4356"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 32.25V25.8C15.75 24.6746 16.6744 23.75 17.7999 23.75H18.1999C19.3254 23.75 20.2498 24.6746 20.2498 25.8V32.25H15.75Z"
        fill="url(#easystay-icon-door)"
      />
      <circle cx="27.4" cy="12.4" r="3.8" fill="#f4d35e" opacity="0.45" />
    </svg>
  );
};

export default LogoIcon;
