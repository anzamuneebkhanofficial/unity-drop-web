/** @format */

'use client';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function CaptchaField({ onVerify }) {
  const [token, setToken] = useState('');
  // console.log('a', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  const handleChange = (value) => {
    setToken(value);
    if (onVerify) onVerify(value); // send token back to parent form
  };

  return (
    <div className="my-3">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={handleChange}
      />
    </div>
  );
}
