/** @format */
'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CaptchaField from '@/components/common/CaptchaField';
import PasswordField from '@/components/common/PasswordField';
// ✅ Validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const AdminLoginPage = () => {
  const router = useRouter();
  const { login, loading, error, success, resetMessages } = useAdminAuthStore();
  const [captchaToken, setCaptchaToken] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  // No prefetching here to avoid caching unauthorized redirect states
  
  // 🛡️ Success Watchdog: If the store reports success, ensure we move.
  useEffect(() => {
    if (success) {
      router.replace('/admin/dashboard');
    }
  }, [success, router]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Verification pending or failed. Please refresh the page.');
      return;
    }
    const result = await login(data.email, data.password, captchaToken);
    if (result) {
      setIsNavigating(true);
      router.replace('/admin/dashboard');
    } else {
      // The store sets error; also check for pending approval status from API
      const { error } = useAdminAuthStore.getState();
      if (error && error.toLowerCase().includes('pending')) {
        toast.warning('⏳ Your account is pending Super Admin approval.\n\nPlease wait for an approval email before logging in.', { duration: 8000 });
      }
    }
  };

  // Removed useEffect based toasts (moved to store for zero-delay response)

  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden">
      {/* Left Brand Panel - Cinematic */}
      <div className="hidden lg:flex flex-col justify-center items-center w-3/5 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--donor-hex),0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-40"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-12 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-[0_0_50px_rgba(var(--donor-hex),0.4)] border border-white/10 scale-125 mb-4">
            <span className="text-white font-black text-4xl tracking-tighter italic drop-shadow-lg">U</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-[clamp(2.5rem,4vw+1rem,3.5rem)] font-black tracking-tighter italic uppercase text-white leading-none">
              UNITYDROP <br />
              <span className="text-donor">ADMIN PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-lg uppercase tracking-widest max-w-md">
              High-Security Access Point for Global Blood Logistics
            </p>
          </div>
          <div className="flex items-center gap-4 pt-12">
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
              Verified Access
            </div>
            <div className="px-6 py-2 bg-donor/10 border border-donor/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-donor">
              Secure Network
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-8 lg:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--highlight-hex),0.05),transparent_50%)]"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 lg:p-14 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-xl space-y-10 relative z-10 theme-admin overflow-x-hidden"
        >
          {/* 🔒 Form lock overlay — prevents any interaction during login/navigation */}
          {(loading || isNavigating) && (
            <div className="absolute inset-0 rounded-[3rem] z-50 cursor-not-allowed" aria-hidden="true" />
          )}
          {/* Header */}
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Admin Login</h2>
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Authorization</p>
          </div>

          <div className="formGroup">
            {/* Email */}
            <div className="formGroup group">
              <label className="formLabel">Enter Verify Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim group-focus-within:text-highlight transition-colors" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter Verify Email"
                      className="inputField pl-14"
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="formError">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="formGroup group">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    field={field}
                    label="Enter Password"
                    placeholder="Enter Your Password"
                    error={errors.password?.message}
                    className="inputField pl-14"
                    iconClass="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-highlight transition-colors"
                  />
                )}
              />
            </div>
          </div>

          <CaptchaField onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={loading || isNavigating}
            className="w-full bg-donor hover:bg-donor/90 text-white font-black uppercase tracking-[0.2em] text-xs py-6 rounded-lg transition-all shadow-[0_10px_30px_rgba(var(--donor-hex),0.2)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-3"
          >
            {(loading || isNavigating) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Logging Please Wait...</span>
              </>
            ) : 'Submit'}
          </button>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              href="/admin/forgot-password"
              className="text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-highlight transition-colors text-center py-2 min-h-[44px] flex items-center justify-center"
            >
              Forgot Password?
            </Link>
            <Link
              href="/admin/register"
              className="text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-highlight transition-colors text-center py-2 min-h-[44px] flex items-center justify-center underline decoration-white/10"
            >
              New Admin Register?
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/public-feedback"
              className="text-[9px] font-black uppercase tracking-[0.3em] text-highlight/60 hover:text-highlight transition-all"
            >
              Technical Issues? Contact System Admin
            </Link>
          </div>

          <div className="h-px bg-white/5 w-full mx-auto"></div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em]">Other Portals</p>
            <div className="flex gap-4">
              <Link href="/patient/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center justify-center">
                Patient Login
              </Link>
              <Link href="/donor/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center justify-center">
                Donor Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
