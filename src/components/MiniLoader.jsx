/** @format */

import React from 'react';

export default function MiniLoader({ size = 16 }) {
  return (
    <div
      className={`animate-spin`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src="/logo3.jpg"
        alt="Loading..."
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
