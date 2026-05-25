/** @format */
'use client';

import React from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import PasswordField from '@/components/common/PasswordField';
import { ShieldCheck, Save, KeyRound } from 'lucide-react';

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

export default function AdminChangePassword() {
  const router = useRouter();
  const { changePassword, loading } = useAdminAuthStore();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(changeSchema),
    defaultValues: { password: '', password_confirmation: '' },
  });

  const onSubmit = async (data) => {
    const result = await changePassword(
      data.password,
      data.password_confirmation
    );
    if (result) {
      router.replace('/admin/dashboard');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn pb-12">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-highlight opacity-50"></div>

        <div className="p-8 md:p-12">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase">Change Password</h2>
                <p className="text-sm text-gray-500 mt-1">Set a new password for your admin account</p>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || loading}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || loading ? 'Saving...' : 'Save Password'}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <KeyRound className="w-5 h-5 text-gray-500" />
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">New Password</h3>
              </div>
              <div className="space-y-2">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <PasswordField
                      field={field}
                      label="New Password"
                      placeholder="Enter new password (min 6 characters)"
                      error={errors.password?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="password_confirmation"
                  control={control}
                  render={({ field }) => (
                    <PasswordField
                      field={field}
                      label="Confirm Password"
                      placeholder="Re-enter your new password"
                      error={errors.password_confirmation?.message}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}