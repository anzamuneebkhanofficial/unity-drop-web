/** @format */
'use client';

import BloodDropLoader from './BloodDropLoader';
import Image from 'next/image';
import Logo from '../../images/anza.jpg';
import './BloodDropLoader.css';

const LoadingSpinner = ({ message = 'Preparing your experience...' }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center w-screen h-screen text-center z-50"
      style={{ backgroundColor: 'black' }}
    >
      {/* Animated Drop Loader */}
      <BloodDropLoader size={160} />

      {/* Logo */}
      <Image
        src={Logo}
        alt="Bachu Code Mascot"
        width={200}
        height={200}
        priority
        className="mb-6 rounded-xl shadow-lg animate-bounce"
      />

      {/* Text Section */}
      {/* <div className="space-y-2 animate-fadeIn">
        <h1
          className="text-3xl md:text-4xl font-extrabold tracking-wide"
          style={{ color: 'var(--text)' }}
        >
          <span style={{ color: 'var(--highlight)' }}>Loading</span> Your Unity
          Drop
        </h1>
        <p className="text-base md:text-lg text-[var(--color-tx)]/80">
          Please wait while we prepare your donation experience 💧
        </p>
      </div> */}

      {/* Quranic Verse Section */}
      <div className="px-6 max-w-2xl text-center animate-fadeIn">
        <blockquote className="italic text-lg md:text-4xl font-semibold text-[var(--highlight)] leading-relaxed">
          "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا"
        </blockquote>
        <p className="mt-3 text-sm md:text-base text-gray-300">
          "And whoever saves one life, it is as if he had saved all of mankind."
          <br />
          <span className="text-gray-400">— Surah Al-Ma’idah (5:32)</span>
        </p>
        <p className="mt-2 text-sm md:text-base text-gray-300">
          "اور جس نے ایک جان کو زندہ کیا گویا اس نے تمام انسانوں کو زندہ کیا۔"
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
