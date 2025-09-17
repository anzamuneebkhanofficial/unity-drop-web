/** @format */
'use client';

import CaptchaField from '@/components/common/CaptchaField';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  QrCodeIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  HomeIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

// ✅ Yup Validation Schema
const registerSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 chars')
    .required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  location: yup.string().required('Location is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/, 'Phone must be valid')
    .required('Phone number is required'),
  // Optional
  address: yup.string().nullable(),
  hospitalName: yup.string().nullable(),
  hospitalAddress: yup.string().nullable(),
  hospitalLocation: yup.string().nullable(),
  availabilityStatus: yup.boolean().nullable(),
});

const InputWithIcon = ({ icon: Icon, field, type = 'text', placeholder }) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    )}
    <input
      {...field}
      type={type}
      placeholder={placeholder}
      className="w-full bg-neutral-900 border border-neutral-700 text-white pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  </div>
);

const PatientRegister = () => {
  const router = useRouter();
  const {
    register: registerPatient,
    loading,
    error,
    success,
    resetMessages,
  } = usePatientAuthStore();
  const [captchaToken, setCaptchaToken] = useState('');
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
      bloodGroup: '',
      location: '',
      phone: '',
      address: '',
      hospitalName: '',
      hospitalAddress: '',
      hospitalLocation: '',
      availabilityStatus: false,
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Please verify captcha');
      return;
    }
    const result = await registerPatient(data, captchaToken);
    if (result) router.push('/patient/email-verify');
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
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 p-8 text-black">
        <QrCodeIcon className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-extrabold">Patient Panel</h1>
        <p className="text-black/80 mt-2 text-center max-w-sm">
          Register as a patient — secure, fast, and reliable.
        </p>
      </div>

      {/* Right Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center text-yellow-400">
            Patient Register
          </h2>
          <div className="flex justify-center">
            <Link
              href="/donor/register"
              className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
            >
              Register as Donor
            </Link>
          </div>

          {/* Required Fields */}
          {/** Full Name */}
          <div>
            <label className="block text-gray-400 mb-1">Full Name</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={UserIcon}
                  field={field}
                  placeholder="Full Name"
                />
              )}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/** Email */}
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={MailIcon}
                  field={field}
                  type="email"
                  placeholder="Email"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/** Password */}
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={LockIcon}
                  field={field}
                  type="password"
                  placeholder="Password"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/** Confirm Password */}
          <div>
            <label className="block text-gray-400 mb-1">Confirm Password</label>
            <Controller
              name="password_confirmation"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={LockIcon}
                  field={field}
                  type="password"
                  placeholder="Confirm Password"
                />
              )}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/** Gender */}
          <div>
            <label className="block text-gray-400 mb-1">Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full bg-neutral-900 border border-neutral-700 text-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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

          {/** Blood Group */}
          <div>
            <label className="block text-gray-400 mb-1">Blood Group</label>
            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full bg-neutral-900 border border-neutral-700 text-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              )}
            />
            {errors.bloodGroup && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bloodGroup.message}
              </p>
            )}
          </div>

          {/** Location */}
          <div>
            <label className="block text-gray-400 mb-1">Location</label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={MapPinIcon}
                  field={field}
                  placeholder="City / Region"
                />
              )}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/** Phone */}
          <div>
            <label className="block text-gray-400 mb-1">Phone</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={PhoneIcon}
                  field={field}
                  placeholder="Phone Number"
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Optional Fields */}
          {/** Address */}
          <div>
            <label className="block text-gray-400 mb-1">
              Address (Optional)
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Address (Optional)"
                  className="w-full bg-neutral-900 border border-neutral-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              )}
            />
          </div>

          {/** Hospital Name */}
          <div>
            <label className="block text-gray-400 mb-1">
              Hospital Name (Optional)
            </label>
            <Controller
              name="hospitalName"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={HomeIcon}
                  field={field}
                  placeholder="Hospital Name (Optional)"
                />
              )}
            />
          </div>

          {/** Hospital Address */}
          <div>
            <label className="block text-gray-400 mb-1">
              Hospital Address (Optional)
            </label>
            <Controller
              name="hospitalAddress"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={MapPinIcon}
                  field={field}
                  placeholder="Hospital Address (Optional)"
                />
              )}
            />
          </div>

          {/** Hospital Location */}
          <div>
            <label className="block text-gray-400 mb-1">
              Hospital Location (Optional)
            </label>
            <Controller
              name="hospitalLocation"
              control={control}
              render={({ field }) => (
                <InputWithIcon
                  icon={MapPinIcon}
                  field={field}
                  placeholder="Hospital Location (Optional)"
                />
              )}
            />
          </div>

          {/** Availability Status */}
          <div className="flex items-center space-x-2">
            <Controller
              name="availabilityStatus"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  {...field}
                  checked={field.value}
                  className="h-4 w-4 accent-yellow-400"
                />
              )}
            />
            <span className="text-gray-300">Available (Optional)</span>
          </div>
          <CaptchaField onVerify={setCaptchaToken} />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-medium py-3 rounded-lg hover:bg-yellow-500 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link
              href="/patient/login"
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

export default PatientRegister;
