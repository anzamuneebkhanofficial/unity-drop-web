/** @format */

'use client';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { useState } from 'react';
import { MessageSquarePlus, Send, Star, SmilePlus } from 'lucide-react';

const reactions = ['❤️', '🔥', '👍', '😡'];

export default function FeedbackForm() {
  const { addFeedback, loading } = usePatientAuthStore();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [reaction, setReaction] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const success = await addFeedback(message, rating, reaction);
    if (success) {
      setMessage('');
      setRating(5);
      setReaction('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        {/* Top color bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-highlight to-highlight/50 opacity-50"></div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-highlight">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase">Send Feedback</h2>
                <p className="text-sm text-gray-500 mt-1">Share your experience or report any issues</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-10">

              {/* Feedback Message */}
              <div className="mb-8">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 ml-1">
                  Your Message
                </label>
                <textarea
                  className="w-full h-32 p-5 bg-[#0f0f0f] border border-white/5 rounded-2xl text-gray-200 focus:outline-none focus:border-highlight/50 transition-all placeholder:text-gray-500 resize-none"
                  placeholder="Describe your experience, report a problem, or suggest an improvement..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Rating Slider */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                      <Star className="w-4 h-4 text-highlight" /> Your Rating
                    </label>
                    <div className="px-3 py-1 bg-[#1a1a1a] rounded-lg border border-white/5 text-sm font-bold text-highlight">
                      {rating} / 5
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-highlight transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-600 font-mono mt-3">
                    <span>Poor</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Reaction Selection */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    <SmilePlus className="w-4 h-4 text-highlight" /> Your Reaction
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {reactions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReaction(r)}
                        className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 ${reaction === r
                            ? 'bg-highlight/10 border-highlight scale-110 shadow-[0_0_15px_rgba(253,199,0,0.3)]'
                            : 'bg-[#1a1a1a] border-white/5 hover:border-highlight/50 hover:bg-[#121212] grayscale hover:grayscale-0'
                          }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="flex items-center justify-center gap-2 bg-highlight hover:bg-highlight/80 text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(253,199,0,0.2)]"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Feedback'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}