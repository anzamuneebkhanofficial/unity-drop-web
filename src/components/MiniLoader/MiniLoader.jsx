/** @format */
'use client';

const MiniSpinner = ({ size = 40, color = 'var(--highlight)' }) => {
  return (
    <div
      className="rounded-full animate-spin"
      style={{
        width: size,
        height: size,
        border: `${Math.max(2, size / 10)}px solid ${color}`,
        borderTopColor: 'transparent',
      }}
      role="status"
      aria-label="Loading"
    ></div>
  );
};

export default MiniSpinner;
