/** @format */
'use client';

import CaptchaField from '@/components/common/CaptchaField';
import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { yupResolver } from '@hookform/resolvers/yup';
import { QrCodeIcon, Mail, Lock, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

// ✅ Validation schema
const registerSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 chars').required(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().required('Phone number is required'),
  availabilityStatus: yup.boolean(),
  key: yup.string().required('Super Key is required'),
});

const AdminRegister = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const router = useRouter();
  const {
    register: registerAdmin,
    loading,
    error,
    success,
    resetMessages,
  } = useAdminAuthStore();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      password_confirmation: '',
      gender: '',
      phone: '',
      availabilityStatus: false,
      key: '',
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Please verify captcha');
      return;
    }
    const result = await registerAdmin(data, captchaToken);
    if (result) {
      router.push('/email-verify');
    }
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
      {/* Left brand panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-neutral-800 to-neutral-900 p-10">
        <QrCodeIcon className="h-20 w-20 text-yellow-400 mb-6" />
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Panel</h1>
        <p className="text-gray-400 mt-4 text-lg text-center max-w-sm">
          Manage the blood donor system securely. Fast, reliable, and powerful.
        </p>
      </div>

      {/* Right register form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-neutral-900 border border-neutral-700 p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
        >
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

          <h2 className="text-3xl font-bold text-center text-yellow-400">
            Admin Register
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-gray-400 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Enter full name"
                    className="w-full pl-10 bg-neutral-950 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          {/* Super Key */}
          <div>
            <label className="block text-gray-400 mb-2">Super Key</label>
            <div className="relative flex items-center gap-2">
              <Controller
                name="key"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number" // ✅ accept only numbers
                    placeholder="Need Key to register (ask the App Owner)"
                    value={field.value}
                    onChange={(e) => {
                      // ensure only numbers are set
                      const numericValue = e.target.value.replace(/\D/g, '');
                      field.onChange(numericValue);
                    }}
                    className="w-full pl-3 bg-neutral-950 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              />
            </div>
            {errors.key && (
              <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
            )}
          </div>

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
                    placeholder="Enter email"
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
                    placeholder="Enter password"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-400 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Controller
                name="password_confirmation"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Confirm password"
                    className="w-full pl-10 bg-neutral-950 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-400 mb-2">Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full bg-neutral-950 border border-neutral-700 text-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Gender</option>
                  <option value="Male" className="text-white">
                    Male
                  </option>
                  <option value="Female" className="text-white">
                    Female
                  </option>
                  <option value="Other" className="text-white">
                    Other
                  </option>
                </select>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-400 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Enter phone number"
                    className="w-full pl-10 bg-neutral-950 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <Controller
              name="availabilityStatus"
              control={control}
              render={({ field }) => (
                <input type="checkbox" {...field} className="h-4 w-4" />
              )}
            />
            <span className="text-gray-300">Available</span>
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          {/* Captcha */}
          <CaptchaField onVerify={setCaptchaToken} />
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link
              href="/admin/login"
              className="text-yellow-400 hover:text-yellow-300 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
