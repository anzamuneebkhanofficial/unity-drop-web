/** @format */

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

/**
 * ReCAPTCHA v3 Implementation (Invisible)
 * includes status indicator to help debug "Please verify captcha" errors.
 */
export default function CaptchaField({ onVerify }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!siteKey) {
      setStatus('error');
      setErrorMessage('Missing Site Key');
      return;
    }

    const generateToken = async () => {
      try {
        if (!window.grecaptcha) {
          throw new Error('reCAPTCHA not loaded');
        }

        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, {
              action: 'submit',
            });
            if (onVerify) {
              onVerify(token);
              setStatus('success');
            }
          } catch (err) {
            console.error('ReCAPTCHA Execution Error:', err);
            setStatus('error');
            // Common error: Invalid key type (using v2 key for v3)
            setErrorMessage('Invalid Key Type? (Need v3 Key)');
          }
        });
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message);
      }
    };

    // Attempt to generate token when script creates global object
    const checkInterval = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        generateToken();
        clearInterval(checkInterval);
      }
    }, 500);

    // Refresh token every 90 seconds
    const refreshInterval = setInterval(() => {
      if (status === 'success') {
        generateToken();
      }
    }, 90 * 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(refreshInterval);
    };
  }, [siteKey, onVerify, status]);

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="afterInteractive"
        onError={() => {
          setStatus('error');
          setErrorMessage('Script Load Failed');
        }}
      />

      <div className="flex items-center justify-center gap-2 mt-4 p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
        {status === 'loading' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-highlight" />
            <span className="text-gray-400">Initializing Security...</span>
          </>
        )}

        {status === 'success' && (
          <>
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-gray-400">
              Protected by <span className="text-gray-300">reCAPTCHA</span>
            </span>
          </>
        )}

        {status === 'error' && (
          <>
            <ShieldAlert className="w-4 h-4 text-donor" />
            <span className="text-donor/80 font-medium">
              Error: {errorMessage}
            </span>
          </>
        )}
      </div>

      <div className="text-[10px] text-gray-600 text-center mt-1">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy" className="underline hover:text-gray-400">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms" className="underline hover:text-gray-400">Terms of Service</a> apply.
      </div>

      <style jsx global>{`
        .grecaptcha-badge { 
          visibility: hidden !important; 
          opacity: 0 !important;
        }
      `}</style>
    </>
  );
}
