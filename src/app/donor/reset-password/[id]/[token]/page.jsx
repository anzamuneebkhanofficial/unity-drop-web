
'use client';

import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import CaptchaField from '@/components/common/CaptchaField';
import PasswordField from '@/components/common/PasswordField';
import { Loader2 } from 'lucide-react';

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

const DonorResetPassword = () => {
  const { resetPassword, loading, resetMessages } = useDonorAuthStore();
  const router = useRouter();
  const { id, token } = useParams();

  const [captchaToken, setCaptchaToken] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  //Clean up store messages on mount
  useEffect(() => {
    resetMessages();
  }, [resetMessages]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Verification pending or failed. Please refresh the page.');
      return;
    }

    const result = await resetPassword(
      id,
      token,
      data.password,
      data.password_confirmation,
      captchaToken
    );

    if (result) {
      setIsNavigating(true);
      router.replace('/donor/login');
    }
  };
  const isFormDisabled = isSubmitting || loading || isNavigating;
  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden">

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
              <span className="text-highlight">DONOR PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-lg uppercase tracking-widest max-w-md">
              Create New Password
            </p>
          </div>
          <div className="flex items-center gap-4 pt-12">
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
              Donor Verified
            </div>
            <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-green-500">
              Live Network
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8 md:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--highlight-hex),0.05),transparent_50%)]"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-xl space-y-10 relative z-10"
        >
          {isFormDisabled && (
            <div className="absolute inset-0 rounded-[3rem] z-50 cursor-not-allowed" aria-hidden="true" />
          )}
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
                    id="password"
                    autoComplete="new-password"
                    label="New Password"
                    placeholder="Enter new password"
                    error={errors.password?.message}
                    disabled={isFormDisabled}
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
                    id="password_confirmation"
                    autoComplete="new-password"
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    error={errors.password_confirmation?.message}
                    disabled={isFormDisabled}
                    className="p-5 bg-bg rounded-2xl border-white/5 focus-within:border-highlight/50"
                  />
                )}
              />
            </div>
          </div>

          <CaptchaField onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={isFormDisabled}
            className="w-full bg-highlight hover:bg-highlight/90 text-black font-black uppercase tracking-[0.2em] text-xs py-6 rounded-2xl transition-all shadow-[0_10px_30px_rgba(var(--highlight-hex),0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isFormDisabled ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Save Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorResetPassword;