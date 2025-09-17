/** @format */
'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { QrCodeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CaptchaField from '@/components/common/CaptchaField';

const verifySchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  otp: yup.string().required('OTP is required'),
});

const inputClass =
  'w-full bg-neutral-900 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400';
const buttonClass =
  'w-full bg-yellow-400 text-black font-medium py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed';

const AdminVerifyEmail = () => {
  const router = useRouter();
  const { verifyEmail, loading, error, success, resetMessages } =
    useAdminAuthStore();
  // inside component
  const [captchaToken, setCaptchaToken] = useState('');
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifySchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Please verify captcha');
      return;
    }
    const result = await verifyEmail(data.email, data.otp, captchaToken);
    if (result) router.push('/admin/login');
    // console.log('result', result);
    // if (result) reset();
  };
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);

    if (success || error) {
      reset();
      resetMessages();
    }
  }, [success, error, reset, resetMessages]);
  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Left brand panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-neutral-800 p-8">
        <QrCodeIcon className="h-16 w-16 text-yellow-400 mb-4" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-400 mt-2 text-center">
          Verify your email to activate your admin account.
        </p>
      </div>

      {/* Right verify form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center text-yellow-400">
            Verify Email
          </h2>

          {/* Email */}
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              )}
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-gray-400 mb-1">OTP</label>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Enter OTP"
                  className={inputClass}
                />
              )}
            />
          </div>
          {/* Captcha */}
          <CaptchaField onVerify={setCaptchaToken} />
          {/* Submit */}
          <button type="submit" className={buttonClass} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <p className="text-sm text-gray-400 text-center">
            Already verified?{' '}
            <Link
              href="/admin/login"
              className="text-yellow-400 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminVerifyEmail;
