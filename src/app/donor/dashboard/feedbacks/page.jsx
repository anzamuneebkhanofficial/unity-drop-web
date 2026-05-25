
'use client';

import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import { useState, useEffect } from 'react';
import { MessageSquarePlus, Send, Star, SmilePlus, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const feedbackSchema = yup.object().shape({
  message: yup.string().required('Message is required').min(5, 'Message must be at least 5 characters long'),
  rating: yup.number().integer().min(1).max(5).required('Rating is required'),
  reaction: yup.string().optional(),
});

const reactions = ['❤️', '🔥', '👍', '😡'];

export default function FeedbackForm() {
  const { addFeedback, loading } = useDonorAuthStore();
  const [mounted, setMounted] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      message: '',
      rating: 5,
      reaction: '',
    },
  });

  const formMessage = watch('message');
  const formRating = watch('rating');
  const formReaction = watch('reaction');

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data) => {
    const success = await addFeedback(data.message, data.rating, data.reaction);

    if (success) {
      reset({
        message: '',
        rating: 5,
        reaction: '',
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-donor to-highlight opacity-50"></div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-donor">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase">Send Feedback</h2>
                <p className="text-sm text-gray-500 mt-1">Share your experience or report any issues</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-10">
              <div className="mb-8">
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 ml-1 cursor-pointer"
                >
                  Your Message
                </label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      id="feedback-message"
                      disabled={loading}
                      className="w-full h-32 p-5 bg-[#0f0f0f] border border-white/5 rounded-2xl text-gray-200 focus:outline-none focus:border-donor/50 transition-all placeholder:text-gray-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Describe your experience, report a problem, or suggest an improvement..."
                      {...field}
                    />
                  )}
                />
                {errors.message && <p className="text-donor text-xs font-semibold mt-2">{errors.message.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label
                      htmlFor="rating-slider"
                      className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest"
                    >
                      <Star className="w-4 h-4 text-donor" /> Your Rating
                    </label>
                    <div className="px-3 py-1 bg-[#1a1a1a] rounded-lg border border-white/5 text-sm font-bold text-donor">
                      {formRating} / 5
                    </div>
                  </div>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="rating-slider"
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={field.value}
                        disabled={loading}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-donor transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    )}
                  />
                  {errors.rating && <p className="text-donor text-xs font-semibold mt-2">{errors.rating.message}</p>}
                  <div className="flex justify-between text-xs text-gray-600 font-mono mt-3">
                    <span>Poor</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    <SmilePlus className="w-4 h-4 text-donor" /> Your Reaction
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {reactions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        disabled={loading}
                        onClick={() => setValue('reaction', r)}
                        className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${formReaction === r
                          ? 'bg-donor/10 border-donor scale-110 shadow-[0_0_15px_rgba(231,77,42,0.3)]'
                          : 'bg-[#1a1a1a] border-white/5 hover:border-donor/50 hover:bg-[#121212] grayscale hover:grayscale-0'
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
                  disabled={loading || !formMessage || !formMessage.trim()}
                  className="flex items-center justify-center gap-2 bg-donor hover:bg-donor/80 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(231,77,42,0.2)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Feedback
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}