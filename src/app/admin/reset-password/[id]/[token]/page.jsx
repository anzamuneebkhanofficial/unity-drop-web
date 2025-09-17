/** @format */
'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import CaptchaField from '@/components/common/CaptchaField';

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

const inputClass =
  'w-full bg-neutral-900 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400';
const buttonClass =
  'w-full bg-yellow-400 text-black font-medium py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed';

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
    if (result) router.push('/admin/login');
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
    <div className="flex min-h-screen bg-neutral-900 text-white items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Reset Password
        </h2>

        <div>
          <label className="block text-gray-400 mb-1">New Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Enter new password"
                className={inputClass}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Confirm Password</label>
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Confirm new password"
                className={inputClass}
              />
            )}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>
        {/* Captcha */}
        <CaptchaField onVerify={setCaptchaToken} />
        <button type="submit" className={buttonClass} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default AdminResetPassword;
