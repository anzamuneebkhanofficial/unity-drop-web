'use client';

import ErrorView from '@/components/common/ErrorView';

export default function Error({ error, reset }) {
  return (
    <ErrorView
      error={error}
      reset={reset}
      type="route"
    />
  );
}
