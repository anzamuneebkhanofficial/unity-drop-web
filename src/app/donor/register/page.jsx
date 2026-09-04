
'use client';

import CaptchaField from '@/components/common/CaptchaField';
import { useDonorAuthStore } from '@/store/auth/authDonorStore';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MailIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import PasswordField from '@/components/common/PasswordField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const registerSchema = yup.object().shape({
  fullName: yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Full name must contain only alphabets and spaces')
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
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
  address: yup.string().required('Address is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/, 'Phone must be between 10 and 15 digits and contain only numbers')
    .required('Phone number is required'),
  availabilityStatus: yup.boolean(),
});

const DonorRegister = () => {
  const router = useRouter();
  const { register: registerDonor, loading, resetMessages } = useDonorAuthStore();

  const [captchaToken, setCaptchaToken] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  // Clean up store messages on mount
  useEffect(() => {
    resetMessages();
  }, [resetMessages]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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
      address: '',
      phone: '',
      availabilityStatus: false,
    },
  });

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error('Verification pending or failed. Please refresh the page.');
      return;
    }

    const result = await registerDonor(data, captchaToken);

    if (result) {
      setIsNavigating(true);
      router.replace('/donor/email-verify');
    }
  };

  const isFormDisabled = isSubmitting || loading || isNavigating;

  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden relative">
      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-text-dim hover:text-white transition-colors bg-surface-2/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-white/30">
         <ArrowLeft className="w-4 h-4" />
         <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
      </Link>
      <div className="hidden lg:flex flex-col justify-center items-center w-2/5 relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--donor-hex),0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20 lg:block hidden"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-12 space-y-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-[0_0_50px_rgba(var(--donor-hex),0.4)] border border-white/10 scale-125 mb-4">
            <span className="text-white font-black text-4xl tracking-tighter italic drop-shadow-lg">U</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-[clamp(2.5rem,4vw+1rem,3.5rem)] font-black tracking-tighter italic uppercase text-white leading-none">
              UNITYDROP <br />
              <span className="text-donor">DONOR PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-lg uppercase tracking-widest max-w-md">
              Join our life-saving network
            </p>
          </div>
          <div className="flex items-center gap-4 pt-12">
            <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
              New Donor
            </div>
            <div className="px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-green-500">
              Quick Registration
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-6 sm:p-8 md:p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.7)] w-full max-w-2xl space-y-5 relative z-10 my-8 overflow-x-hidden"
        >
          {isFormDisabled && (
            <div className="absolute inset-0 rounded-[2rem] z-50 cursor-not-allowed" aria-hidden="true" />
          )}
          <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Donor Registration</h2>
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.3em]">Create Your Account</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="formGroup group">
              <label htmlFor="fullName" className="formLabel">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-donor transition-colors" />
                <Controller name="fullName" control={control} render={({ field }) => (
                  <input
                    {...field}
                    id="fullName"
                    type="text"
                    autoComplete="off"
                    disabled={isFormDisabled}
                    placeholder="Enter Full Name"
                    className="inputField pl-14"
                  />
                )} />
              </div>
              {errors.fullName && <p className="formError">{errors.fullName.message}</p>}
            </div>
            <div className="formGroup group">
              <label htmlFor="email" className="formLabel">Email Address</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-donor transition-colors" />
                <Controller name="email" control={control} render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="off"
                    disabled={isFormDisabled}
                    placeholder="Enter Email"
                    className="inputField pl-14"
                  />
                )} />
              </div>
              {errors.email && <p className="formError">{errors.email.message}</p>}
            </div>
            <div className="formGroup group">
              <Controller name="password" control={control} render={({ field }) => (
                <PasswordField
                  field={field}
                  id="password"
                  autoComplete="new-password"
                  label="Password"
                  placeholder="Create Password"
                  error={errors.password?.message}
                  disabled={isFormDisabled}
                />
              )} />
            </div>
            <div className="formGroup group">
              <Controller name="password_confirmation" control={control} render={({ field }) => (
                <PasswordField
                  field={field}
                  id="password_confirmation"
                  autoComplete="new-password"
                  label="Confirm Key"
                  placeholder="Repeat Password"
                  error={errors.password_confirmation?.message}
                  disabled={isFormDisabled}
                />
              )} />
            </div>
            <div className="formGroup group">
              <label htmlFor="gender" className="formLabel">Gender</label>
              <Controller name="gender" control={control} render={({ field }) => (
                <select {...field} id="gender" disabled={isFormDisabled} className="selectField">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              )} />
              {errors.gender && <p className="formError">{errors.gender.message}</p>}
            </div>
            <div className="formGroup group">
              <label htmlFor="bloodGroup" className="formLabel">Blood Group</label>
              <Controller name="bloodGroup" control={control} render={({ field }) => (
                <select {...field} id="bloodGroup" disabled={isFormDisabled} className="selectField">
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
            <div className="formGroup group">
              <label htmlFor="phone" className="formLabel">Phone</label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-donor transition-colors" />
                <Controller name="phone" control={control} render={({ field }) => (
                  <input
                    {...field}
                    id="phone"
                    type="tel"
                    autoComplete="off"
                    disabled={isFormDisabled}
                    placeholder="Phone Number"
                    className="inputField pl-14"
                  />
                )} />
              </div>
              {errors.phone && <p className="formError">{errors.phone.message}</p>}
            </div>
            <div className="formGroup group">
              <label htmlFor="location" className="formLabel">Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-donor transition-colors" />
                <Controller name="location" control={control} render={({ field }) => (
                  <input
                    {...field}
                    id="location"
                    disabled={isFormDisabled}
                    placeholder="City / Region"
                    className="inputField pl-14"
                  />
                )} />
              </div>
              {errors.location && <p className="formError">{errors.location.message}</p>}
            </div>
          </div>
          <div className="formGroup group">
            <label htmlFor="address" className="formLabel">Full Address</label>
            <Controller name="address" control={control} render={({ field }) => (
              <textarea
                {...field}
                id="address"
                autoComplete="off"
                rows={2}
                disabled={isFormDisabled}
                placeholder="Enter Full Address"
                className="inputField resize-none"
              />
            )} />
            {errors.address && <p className="formError">{errors.address.message}</p>}
          </div>
          <label className={`flex items-center gap-3 px-1 w-fit ${isFormDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <Controller name="availabilityStatus" control={control} render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                disabled={isFormDisabled}
                checked={field.value}
                className="h-4 w-4 accent-donor rounded"
              />
            )} />
            <span className="text-text-dim text-xs font-bold">Available for Donation</span>
          </label>

          <CaptchaField onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={isFormDisabled}
            className="w-full bg-donor hover:bg-donor/90 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(var(--donor-hex),0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center gap-3"
          >
            {isFormDisabled ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering Please Wait...
              </>
            ) : (
              'Submit'
            )}
          </button>
          <div className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-[10px] font-bold text-text-dim">
                Already registered?{' '}
                <Link href="/donor/login" className="text-donor hover:text-white transition-colors font-black uppercase tracking-wider relative z-10">
                  Login Here
                </Link>
              </p>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em]">Register As</p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link href="/patient/register" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center justify-center relative z-10">
                  Patient
                </Link>
                <Link href="/admin/register" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center justify-center relative z-10">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorRegister;