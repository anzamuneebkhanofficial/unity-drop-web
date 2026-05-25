'use client';

import ErrorView from '@/components/common/ErrorView';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="bg-bg text-white">
        <ErrorView
          error={error}
          reset={reset}
          type="global"
        />
      </body>
    </html>
  );
}
