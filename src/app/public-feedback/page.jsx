/** @format */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner'; // Using sonner for consistency with register
import { useRouter } from 'next/navigation';
import apiWrapper from '@/lib/apiWrapper';
import { Mail, User, MessageSquare } from 'lucide-react';
import CaptchaField from '@/components/common/CaptchaField';
import Link from 'next/link';

const feedbackSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required'),
});

const PublicFeedbackPage = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedbackSchema),
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Verification pending or failed. Please refresh the page.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiWrapper.post('/public-feedback', { ...data, captchaToken });
      if (res.data.success) {
        toast.success('Feedback submitted successfully!');
        reset();
        router.push('/');
      } else {
        toast.error(res.data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden items-center justify-center p-6 md:p-10 theme-patient">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.7)] w-full max-w-xl space-y-5 relative z-10"
      >
        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Public Feedback</h2>
          <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.3em]">Send us a message to request access or report issues</p>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="formGroup group">
            <label className="formLabel">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
              <input {...register('name')} placeholder="Your Name" className="inputField pl-14" />
            </div>
            {errors.name && <p className="formError">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="formGroup group">
            <label className="formLabel">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
              <input {...register('email')} type="email" placeholder="Your Email" className="inputField pl-14" />
            </div>
            {errors.email && <p className="formError">{errors.email.message}</p>}
          </div>

          {/* Message */}
          <div className="formGroup group">
            <label className="formLabel">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
              <textarea {...register('message')} placeholder="Your Message" className="inputField pl-14 min-h-[120px] py-4 resize-y" />
            </div>
            {errors.message && <p className="formError">{errors.message.message}</p>}
          </div>
        </div>

        <CaptchaField onVerify={setCaptchaToken} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-highlight hover:bg-highlight/90 text-black font-black uppercase tracking-[0.2em] text-xs py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(var(--highlight-hex),0.2)] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>

        <div className="text-center pt-4">
          <Link href="/" className="text-text-dim hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PublicFeedbackPage;
