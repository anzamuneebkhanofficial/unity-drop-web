
'use client';

import React, { useEffect, useState } from 'react';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CaptchaField from '@/components/common/CaptchaField';
import PasswordField from '@/components/common/PasswordField';
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const PatientLoginPage = () => {
  const router = useRouter();
  const { login, loading, success, resetMessages } = usePatientAuthStore();

  const [captchaToken, setCaptchaToken] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  // Clean up store messages on mount
  useEffect(() => {
    resetMessages();
  }, [resetMessages]);

  // Success
  useEffect(() => {
    if (success) {
      router.replace('/patient/dashboard');
    }
  }, [success, router]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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
      router.replace('/patient/dashboard');
    } else {
      const { error: storeError } = usePatientAuthStore.getState();
      if (storeError) {
        toast.error(storeError);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden relative">
      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-text-dim hover:text-white transition-colors bg-surface-2/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-white/30">
         <ArrowLeft className="w-4 h-4" />
         <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
      </Link>
      <div className="hidden lg:flex flex-col justify-center items-center w-3/5 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--highlight-hex),0.12),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-12 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-highlight to-highlight/60 flex items-center justify-center shadow-[0_0_50px_rgba(var(--highlight-hex),0.35)] border border-white/10 scale-125 mb-4">
            <span className="text-black font-black text-4xl tracking-tighter italic drop-shadow-lg">U</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-[clamp(2.5rem,4vw+1rem,3.5rem)] font-black tracking-tighter italic uppercase text-white leading-none">
              UNITYDROP <br />
              <span className="text-highlight">PATIENT PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-lg uppercase tracking-widest max-w-md">
              Secure Access to Health Records & Donor Network
            </p>
          </div>
          <div className="flex items-center gap-4 pt-12">
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
              Patient Verified
            </div>
            <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-green-500">
              Live Network
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-1 items-center justify-center p-6 md:p-8 lg:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--highlight-hex),0.05),transparent_50%)]"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 lg:p-14 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-xl space-y-10 relative z-10 theme-patient overflow-x-hidden"
        >

          {(loading || isNavigating) && (
            <div className="absolute inset-0 rounded-[3rem] z-50 cursor-not-allowed" aria-hidden="true" />
          )}


          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Patient Login</h2>
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">Enter Your Details</p>
          </div>

          <div className="formGroup">

            <div className="formGroup group">
              <label htmlFor="email" className="formLabel">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim group-focus-within:text-highlight transition-colors" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter Email Address"
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


            <div className="formGroup group">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    field={field}
                    id="password"
                    autoComplete="current-password"
                    label="Password"
                    placeholder="Enter Password"
                    error={errors.password?.message}
                    inputClass="inputField pl-14"
                    iconClass="absolute left-5 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-highlight transition-colors"
                  />
                )}
              />
            </div>
          </div>

          <CaptchaField onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={isSubmitting || isNavigating}
            className="w-full bg-highlight hover:bg-highlight/90 text-black font-black uppercase tracking-[0.2em] text-xs py-6 rounded-lg transition-all shadow-[0_10px_30px_rgba(var(--highlight-hex),0.2)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-3"
          >
            {(isSubmitting || isNavigating) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Logging in Please Wait ...</span>
              </>
            ) : 'Submit'}
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              href="/patient/forgot-password"
              className="text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-highlight transition-colors text-center py-2 min-h-[44px] flex items-center justify-center"
            >
              Forgot Password?
            </Link>
            <Link
              href="/patient/register"
              className="text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-highlight transition-colors text-center py-2 min-h-[44px] flex items-center justify-center"
            >
              New Patient Register
            </Link>
          </div>

          <div className="h-px bg-white/5 w-full mx-auto"></div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em]">Other Portals</p>
            <div className="flex gap-4">
              <Link href="/donor/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center justify-center">
                Donor
              </Link>
              <Link href="/admin/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center justify-center">
                Admin
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientLoginPage;