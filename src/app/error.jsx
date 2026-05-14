'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('🔵 error.jsx CAUGHT:', error);
    console.log('📍 Error Source: Route Level (error.jsx)');
    console.log('🔍 UI Should Show: "Application Error" page');
    
    // You can integrate with error monitoring services here
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-white p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-highlight">Application Error</h1>
          <p className="text-text-muted">
            Something unexpected happened. Our team has been notified.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-highlight text-black font-semibold rounded-lg hover:bg-highlight/90 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-surface text-white font-semibold rounded-lg hover:bg-surface/90 transition-colors"
          >
            Go Home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-surface/50 rounded-lg text-left">
            <summary className="cursor-pointer text-sm font-mono text-text-muted">
              Error Details (Dev Only)
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
