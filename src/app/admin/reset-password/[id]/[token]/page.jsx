/** @format */
'use client';

import React, { useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams, useRouter } from 'next/navigation';
import CaptchaField from '@/components/common/CaptchaField';
import PasswordField from '@/components/common/PasswordField';

const resetSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password too short')
    .required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const AdminResetPassword = () => {
  const { resetPassword, loading, error, success, resetMessages } =
    useAdminAuthStore();
  const router = useRouter();
  // inside component
  const [captchaToken, setCaptchaToken] = useState('');
  const { id, token } = useParams();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await resetPassword(
      id,
      token,
      data.password,
      data.password_confirmation,
      captchaToken
    );
    // console.log('result', result);
    if (result) router.replace('/admin/login');
  };

  // Feedback handled by global interceptor

  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden">
      {/* Left Brand Panel - Cinematic */}
      <div className="hidden lg:flex flex-col justify-center items-center w-3/5 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--highlight-hex),0.12),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-12 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-highlight to-highlight/60 flex items-center justify-center shadow-[0_0_50px_rgba(var(--highlight-hex),0.35)] border border-white/10 scale-125 mb-4">
            <span className="text-black font-black text-4xl tracking-tighter italic drop-shadow-lg">U</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
              UNITYDROP <br />
              <span className="text-highlight">ADMIN PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-lg uppercase tracking-widest max-w-md">
              Create New Password
            </p>
          </div>
          <div className="flex items-center gap-4 pt-12">
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
              Admin Verified
            </div>
            <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-green-500">
              Live Network
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex flex-1 items-center justify-center p-8 md:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--highlight-hex),0.05),transparent_50%)]"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-xl space-y-10 relative z-10"
        >
          {/* Header */}
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Reset Password</h2>
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">Set your new password</p>
          </div>

          <div className="space-y-6">

            <div className="space-y-2 group">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    field={field}
                    label="New Password"
                    placeholder="Enter new password"
                    error={errors.password?.message}
                    className="p-5 bg-bg rounded-2xl border-white/5 focus-within:border-highlight/50"
                  />
                )}
              />
            </div>

            <div className="space-y-2 group">
              <Controller
                name="password_confirmation"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    field={field}
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    error={errors.password_confirmation?.message}
                    className="p-5 bg-bg rounded-2xl border-white/5 focus-within:border-highlight/50"
                  />
                )}
              />
            </div>

          </div>

          <CaptchaField onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-highlight hover:bg-highlight/90 text-black font-black uppercase tracking-[0.2em] text-xs py-6 rounded-2xl transition-all shadow-[0_10px_30px_rgba(var(--highlight-hex),0.2)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Password'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
