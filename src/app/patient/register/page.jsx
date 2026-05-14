/** @format */
'use client';

import CaptchaField from '@/components/common/CaptchaField';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MailIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  HomeIcon,
} from 'lucide-react';
import PasswordField from '@/components/common/PasswordField';
import Link from 'next/link';
import LocationPicker from '@/components/common/LocationPicker';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
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
    setValue,
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
      latitude: '',
      longitude: '',
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Verification pending or failed. Please refresh the page.');
      return;
    }
    const result = await registerPatient(data, captchaToken);
    if (result) router.replace('/patient/email-verify');
  };
  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden">
      {/* Left Brand Panel - Narrower for register */}
      <div className="hidden lg:flex flex-col justify-center items-center w-2/5 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--highlight-hex),0.12),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-highlight to-highlight/60 flex items-center justify-center shadow-[0_0_40px_rgba(var(--highlight-hex),0.35)] border border-white/10">
            <span className="text-black font-black text-3xl tracking-tighter italic drop-shadow-lg">U</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white leading-none">
              UNITYDROP <br />
              <span className="text-highlight">PATIENT PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-sm uppercase tracking-widest max-w-xs">
              Secure Access to Health Records & Donor Network
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-text-dim">
              Patient Verified
            </div>
            <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-green-500">
              Live Network
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel - Wider for more fields */}
      <div className="flex flex-1 items-start justify-center p-6 md:p-10 overflow-y-auto min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.7)] w-full max-w-2xl space-y-5 relative z-10 my-8 theme-patient"
        >
          {/* Header */}
          <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Patient Registration</h2>
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.3em]">Create Your Account</p>
          </div>

          {/* Required Fields in 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="formGroup group">
              <label className="formLabel">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                <Controller name="fullName" control={control} render={({ field }) => (
                  <input {...field} placeholder="Enter Full Name" className="inputField pl-14" />
                )} />
              </div>
              {errors.fullName && <p className="formError">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="formGroup group">
              <label className="formLabel">Email Address</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                <Controller name="email" control={control} render={({ field }) => (
                  <input {...field} type="email" placeholder="Enter Email" className="inputField pl-14" />
                )} />
              </div>
              {errors.email && <p className="formError">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="formGroup group">
              <Controller name="password" control={control} render={({ field }) => (
                <PasswordField
                  field={field}
                  label="Password"
                  placeholder="Create Password"
                  error={errors.password?.message}
                />
              )} />
            </div>

            {/* Confirm Password */}
            <div className="formGroup group">
              <Controller name="password_confirmation" control={control} render={({ field }) => (
                <PasswordField
                  field={field}
                  label="Confirm Key"
                  placeholder="Repeat Password"
                  error={errors.password_confirmation?.message}
                />
              )} />
            </div>

            {/* Gender */}
            <div className="formGroup group">
              <label className="formLabel">Gender</label>
              <Controller name="gender" control={control} render={({ field }) => (
                <select {...field} className="selectField">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              )} />
              {errors.gender && <p className="formError">{errors.gender.message}</p>}
            </div>

            {/* Blood Group */}
            <div className="formGroup group">
              <label className="formLabel">Blood Group</label>
              <Controller name="bloodGroup" control={control} render={({ field }) => (
                <select {...field} className="selectField">
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
              )} />
              {errors.bloodGroup && <p className="formError">{errors.bloodGroup.message}</p>}
            </div>

            {/* Phone */}
            <div className="formGroup group">
              <label className="formLabel">Phone</label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                <Controller name="phone" control={control} render={({ field }) => (
                  <input {...field} placeholder="Phone Number" className="inputField pl-14" />
                )} />
              </div>
              {errors.phone && <p className="formError">{errors.phone.message}</p>}
            </div>

            {/* Location */}
            <div className="formGroup group">
              <label className="formLabel">Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                <Controller name="location" control={control} render={({ field }) => (
                  <input {...field} placeholder="City / Region" className="inputField pl-14" />
                )} />
              </div>
              <LocationPicker
                className="mt-1"
                onLocationDetected={({ latitude, longitude, city, address }) => {
                  setValue('latitude', latitude);
                  setValue('longitude', longitude);
                  if (city) setValue('location', city);
                  if (address) setValue('address', address);
                }}
              />
              {errors.location && <p className="formError">{errors.location.message}</p>}
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-3 pt-2">
            <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-highlight/60"></span>
              Optional Details
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address */}
              <div className="space-y-1.5 group md:col-span-2">
                <label className="formLabel">Address</label>
                <Controller name="address" control={control} render={({ field }) => (
                  <textarea {...field} rows={2} placeholder="Your Address (Optional)" className="inputField resize-none" />
                )} />
              </div>

              {/* Hospital Name */}
              <div className="formGroup group">
                <label className="formLabel">Hospital Name</label>
                <div className="relative">
                  <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                  <Controller name="hospitalName" control={control} render={({ field }) => (
                    <input {...field} placeholder="Hospital (Optional)" className="inputField pl-14" />
                  )} />
                </div>
              </div>

              {/* Hospital Address */}
              <div className="formGroup group">
                <label className="formLabel">Hospital Address</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                  <Controller name="hospitalAddress" control={control} render={({ field }) => (
                    <input {...field} placeholder="Hospital Address (Optional)" className="inputField pl-14" />
                  )} />
                </div>
              </div>

              {/* Hospital Location */}
              <div className="formGroup group">
                <label className="formLabel">Hospital Location</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                  <Controller name="hospitalLocation" control={control} render={({ field }) => (
                    <input {...field} placeholder="Hospital Location (Optional)" className="inputField pl-14" />
                  )} />
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 px-1">
                <Controller name="availabilityStatus" control={control} render={({ field }) => (
                  <input type="checkbox" {...field} checked={field.value} className="h-4 w-4 accent-highlight rounded" />
                )} />
                <span className="text-text-dim text-xs font-bold">Available (Optional)</span>
              </div>
            </div>
          </div>

          <CaptchaField onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-highlight hover:bg-highlight/90 text-black font-black uppercase tracking-[0.2em] text-xs py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(var(--highlight-hex),0.2)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Registering Pleae Wait...' : 'Submit'}
          </button>

          {/* Footer Links */}
          <div className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-[10px] font-bold text-text-dim">
                Already registered?{' '}
                <Link href="/patient/login" className="text-highlight hover:text-white transition-colors font-black uppercase tracking-wider">
                  Login Here
                </Link>
              </p>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em]">Register As</p>
              <div className="flex gap-3">
                <Link href="/donor/register" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all">
                  Donor Register
                </Link>
                <Link href="/admin/register" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all">
                  Admin Register
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegister;
