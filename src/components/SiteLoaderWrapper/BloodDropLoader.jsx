/** @format */
import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../../../public/blood.json'; // adjust path if needed

export default function BloodDropLoader({ size = 250 }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        autoplay={true}
        // initialSegment={[0, 50]}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
