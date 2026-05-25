

'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

const POLL_INTERVAL_MS = 500;
const TOKEN_REFRESH_MS = 90 * 1000;

export default function CaptchaField({ onVerify }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  // Keep track of the latest onVerify without triggering re-renders
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!siteKey) {
      setStatus('error');
      setErrorMessage('Missing Site Key');
      return;
    }

    let isMounted = true;
    let pollInterval;
    let refreshTimeout;

    const executeRecaptcha = () => {
      if (!window.grecaptcha?.execute) return;

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, {
            action: 'submit',
          });

          if (isMounted) {
            onVerifyRef.current?.(token);
            setStatus('success');
            // schedule the next refresh
            refreshTimeout = setTimeout(executeRecaptcha, TOKEN_REFRESH_MS);
          }
        } catch (err) {
          if (isMounted) {
            console.error('ReCAPTCHA Execution Error:', err);
            setStatus('error');
            setErrorMessage('Invalid Key Type? (Need v3 Key)');
          }
        }
      });
    };
    // until the script and execute method are fully loaded
    pollInterval = setInterval(() => {
      if (window.grecaptcha?.execute) {
        clearInterval(pollInterval);
        executeRecaptcha();
      }
    }, POLL_INTERVAL_MS);

    // Cleanup phase
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      clearTimeout(refreshTimeout);
    };
  }, [siteKey]); // ONLY siteKey determines when to rebuild the core loop

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