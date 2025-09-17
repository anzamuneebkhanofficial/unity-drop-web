/** @format */
'use client';

import MiniSpinner from '../MiniLoader/MiniLoader';

const SectionLoader = ({
  message = 'Preparing your experience...',
  size = 56,
  height = 200, // 👈 dynamic height for container
}) => {
  return (
    <div
      className="relative flex flex-col justify-center items-center text-center rounded-lg"
      style={{ minHeight: height, backgroundColor: 'var(--bg)' }}
    >
      {/* Spinner */}
      <MiniSpinner size={size} color="var(--highlight)" />

      {/* Message */}
      {message && (
        <p
          className="mt-3 text-base md:text-lg font-medium animate-fadeIn"
          style={{ color: 'var(--text)', opacity: 0.9 }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default SectionLoader;
