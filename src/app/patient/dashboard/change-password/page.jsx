/** @format */
'use client';

import React, { useEffect } from 'react';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const changeSchema = yup.object().shape({
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
  'w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400';
const buttonClass =
  'w-full bg-yellow-400 py-3 rounded-lg font-medium text-black hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed';

export default function PatientChangePassword() {
  const router = useRouter();
  const { changePassword, loading, error, success, resetMessages } =
    usePatientAuthStore();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changeSchema),
    defaultValues: { password: '', password_confirmation: '' },
  });

  const onSubmit = async (data) => {
    const result = await changePassword(
      data.password,
      data.password_confirmation
    );
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Change Password (Patient)
        </h2>
        <p className="text-sm text-gray-400 text-center">
          Update your patient account password below
        </p>

        {/* New Password */}
        <div>
          <label className="block text-gray-400 mb-1">New Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input {...field} type="password" className={inputClass} />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-400 mb-1">Confirm Password</label>
          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <input {...field} type="password" className={inputClass} />
            )}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <button type="submit" className={buttonClass} disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
