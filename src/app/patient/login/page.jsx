/** @format */
'use client';

import React, { useEffect, useState } from 'react';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { QrCodeIcon, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CaptchaField from '@/components/common/CaptchaField';

// ✅ Validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const PatientLoginPage = () => {
  const router = useRouter();
  const { login, loading, error, success, resetMessages } =
    usePatientAuthStore();
  const [captchaToken, setCaptchaToken] = useState('');
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
      toast.error('Please verify captcha');
      return;
    }
    const result = await login(data.email, data.password, captchaToken);
    if (result) router.push('/patient/dashboard');
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
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Left Brand Panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-neutral-800 to-neutral-900 p-10">
        <QrCodeIcon className="h-20 w-20 text-yellow-400 mb-6" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          Patient Panel
        </h1>
        <p className="text-gray-400 mt-4 text-lg text-center max-w-sm">
          Secure login to manage your health records, appointments, and personal
          details.
        </p>
      </div>

      {/* Right Login Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-neutral-900 border border-neutral-700 p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
        >
          {/* Alt login options */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/donor/login"
              className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
            >
              Login as Donor
            </Link>
            <Link
              href="/admin/login"
              className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
            >
              Login as Admin
            </Link>
            <div className="w-20 border-t border-gray-600 mt-2"></div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-yellow-400">
            Patient Login
          </h2>

          {/* Email */}
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Enter your email"
                    className="w-full pl-10 bg-neutral-950 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-10 bg-neutral-950 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <CaptchaField onVerify={setCaptchaToken} />
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Forgot password */}
          <p className="text-sm text-gray-400 text-center">
            Forgot your password?{' '}
            <Link
              href="/patient/forgot-password"
              className="text-yellow-400 hover:text-yellow-300 hover:underline"
            >
              Reset here
            </Link>
          </p>

          {/* Alt registration options */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/patient/register"
              className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
            >
              Register as Patient
            </Link>
            <Link
              href="/donor/register"
              className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
            >
              Register as Donor
            </Link>
            <div className="w-20 border-t border-gray-600 mt-2"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientLoginPage;
