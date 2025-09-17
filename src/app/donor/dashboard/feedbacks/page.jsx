/** @format */

// components/Feedback/FeedbackForm.jsx
'use client';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import { useState } from 'react';

import { toast } from 'sonner';

export default function FeedbackForm() {
  const { addFeedback, loading } = useDonorAuthStore();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addFeedback(message, rating);
    if (success) {
      toast.success('Feedback submitted ✅');
      setMessage('');
      setRating(5);
    } else {
      toast.error('Failed to submit feedback ❌');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg border border-highlight rounded p-4 mt-6 space-y-4"
    >
      <h2 className="text-xl font-bold">Give Feedback</h2>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <div>
        <label className="block mb-1">Rating: {rating}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-highlight text-white px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
