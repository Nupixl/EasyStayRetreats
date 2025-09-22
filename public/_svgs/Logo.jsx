import React from "react";

const Logo = (_props, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 text-blackColor"
      aria-label="EasyStay Retreats"
    >
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        role="presentation"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="easystay-roof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f7a8c" />
            <stop offset="100%" stopColor="#134e6f" />
          </linearGradient>
          <linearGradient id="easystay-door" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4d35e" />
            <stop offset="100%" stopColor="#f6b146" />
          </linearGradient>
        </defs>
        <path
          d="M20.9999 5.2L5.25 18.1667V36.75H14.4375V26.8333H27.5624V36.75H36.7499V18.1667L20.9999 5.2Z"
          fill="url(#easystay-roof)"
          stroke="#0f4356"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M18.6666 36.75V29.1667C18.6666 27.906 19.6872 26.8854 20.9479 26.8854H21.052C22.3127 26.8854 23.3333 27.906 23.3333 29.1667V36.75H18.6666Z"
          fill="url(#easystay-door)"
        />
        <circle
          cx="31.5"
          cy="14.2"
          r="4.2"
          fill="#f4d35e"
          opacity="0.45"
        />
      </svg>
      <div className="leading-tight">
        <p className="text-[24px] font-semibold tracking-tight">EasyStay</p>
        <p className="text-[12px] uppercase tracking-[0.45em] text-primaryColor font-semibold">
          Retreats
        </p>
      </div>
    </div>
  );
};

export default React.forwardRef(Logo);
