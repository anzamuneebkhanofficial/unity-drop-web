'use client';

import { useEffect } from 'react';

export default function ErrorView({ error, reset, type = 'route' }) {
  const isGlobal = type === 'global';

  useEffect(() => {
    if (isGlobal) {
      console.error('🔴 global-error.jsx CAUGHT:', error);
      console.log('📍 Error Source: App Level (global-error.jsx)');
      console.log('🔍 UI Should Show: "Critical Error" page (RED theme)');
      console.log('⚠️  This is the LAST RESORT error handler!');
    } else {
      console.error('🔵 error.jsx CAUGHT:', error);
      console.log('📍 Error Source: Route Level (error.jsx)');
      console.log('🔍 UI Should Show: "Application Error" page');
    }
  }, [error, isGlobal]);

  const title = isGlobal ? 'Critical Error' : 'Application Error';
  const titleClass = isGlobal ? 'text-red-500' : 'text-highlight';
  const message = isGlobal
    ? 'A critical error occurred. Please refresh the page or contact support.'
    : 'Something unexpected happened. Our team has been notified.';
  const tryAgainBtnClass = isGlobal
    ? 'bg-red-500 text-white hover:bg-red-600'
    : 'bg-highlight text-black hover:bg-highlight/90';

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-white p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold ${titleClass}`}>{title}</h1>
          <p className="text-text-muted">{message}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className={`w-full px-4 py-2 font-semibold rounded-lg transition-colors ${tryAgainBtnClass}`}
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="w-full px-4 py-2 bg-surface text-white font-semibold rounded-lg hover:bg-surface/90 transition-colors"
          >
            Go Home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-surface/50 rounded-lg text-left">
            <summary className="cursor-pointer text-sm font-mono text-text-muted">
              {isGlobal ? 'Global Error Details (Dev Only)' : 'Error Details (Dev Only)'}
            </summary>
            <pre className="mt-2 text-xs text-red-400 overflow-auto whitespace-pre-wrap">
              {error?.message || error?.toString()}
              {error?.stack && '\n\nStack:\n' + error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
