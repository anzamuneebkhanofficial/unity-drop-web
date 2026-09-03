
'use client';

import CaptchaField from '@/components/common/CaptchaField';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, Phone, User, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import PasswordField from '@/components/common/PasswordField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
const registerSchema = yup.object().shape({
  fullName: yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Full name must contain only alphabets and spaces')
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 chars').required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone must be between 10 and 15 digits and contain only numbers')
    .required('Phone number is required'),
  location: yup.string().required('Location is required'),
  availabilityStatus: yup.boolean(),
});

const AdminRegister = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isCheckingQuota, setIsCheckingQuota] = useState(true);

  const router = useRouter();
  const {
    register: registerAdmin,
    getAdminStatus,
    loading,
  } = useAdminAuthStore();

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
      phone: '',
      location: '',
      availabilityStatus: false,
    },
  });
  //Check quota safely 
  useEffect(() => {
    let mounted = true;

    const checkQuota = async () => {
      try {
        const status = await getAdminStatus();
        if (mounted && status?.limitReached) {
          setIsLimitReached(true);
        }
      } finally {
        if (mounted) setIsCheckingQuota(false);
      }
    };

    checkQuota();

    return () => {
      mounted = false;
    };
  }, [getAdminStatus]);

  const onSubmit = async (data) => {
    if (isLimitReached) {
      toast.error('Administrator quota is full. Registration is disabled.');
      return;
    }
    if (!captchaToken) {
      toast.error('Verification pending or failed. Please refresh the page.');
      return;
    }
    const result = await registerAdmin(data, captchaToken);
    if (result) {
      router.replace('/admin/email-verify');
    } else {
      const err = useAdminAuthStore.getState().error;
      if (err) toast.error(err);
    }
  };

  const isFormDisabled = isLimitReached || isCheckingQuota || isSubmitting || loading;

  return (
    <div className="flex min-h-screen bg-bg text-white overflow-hidden relative">
      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-text-dim hover:text-white transition-colors bg-surface-2/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-white/30">
         <ArrowLeft className="w-4 h-4" />
         <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
      </Link>
      {isLimitReached && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white font-bold text-center py-3 z-50 shadow-lg">
          Admin quota is full. Registration is disabled. Please use the{' '}
          <Link href="/public-feedback" className="underline hover:text-white/80 transition-colors">
            Public Feedback form
          </Link>{' '}
          to request access.
        </div>
      )}

      <div className="hidden lg:flex flex-col justify-center items-center w-2/5 relative overflow-hidden bg-surface pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--donor-hex),0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/5 rounded-full opacity-30"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-8 space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-donor to-donor/60 flex items-center justify-center shadow-[0_0_40px_rgba(var(--donor-hex),0.4)] border border-white/10">
            <span className="text-white font-black text-3xl tracking-tighter italic drop-shadow-lg">U</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white leading-none">
              UNITYDROP <br />
              <span className="text-donor">ADMIN PORTAL</span>
            </h1>
            <p className="text-text-dim font-bold text-sm uppercase tracking-widest max-w-xs">
              Admin Registration
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-text-dim">
              Verified Access
            </div>
            <div className="px-4 py-1.5 bg-donor/10 border border-donor/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-donor">
              Secure Network
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-center p-6 md:p-10 overflow-y-auto min-h-screen pt-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-2/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.7)] w-full max-w-2xl space-y-5 relative z-10 my-8 theme-admin"
        >

          <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Admin Registration</h2>
            <p className="text-text-dim text-[10px] font-black uppercase tracking-[0.3em]">Fill in your details</p>
          </div>
          <div className={`space-y-5 transition-opacity duration-300 ${isLimitReached ? 'opacity-50 grayscale' : ''}`}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="formGroup group">
                <label htmlFor="fullName" className="formLabel">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                  <Controller name="fullName" control={control} render={({ field }) => (
                    <input
                      {...field}
                      id="fullName"
                      type="text"
                      autoComplete="name"
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
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                  <Controller name="email" control={control} render={({ field }) => (
                    <input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      disabled={isFormDisabled}
                      placeholder="Enter Email"
                      className="inputField pl-14"
                    />
                  )} />
                </div>
                {errors.email && <p className="formError">{errors.email.message}</p>}
              </div>
              <div className="formGroup group">
                <label htmlFor="phone" className="formLabel">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
                  <Controller name="phone" control={control} render={({ field }) => (
                    <input
                      {...field}
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      disabled={isFormDisabled}
                      placeholder="Phone Number"
                      className="inputField pl-14"
                    />
                  )} />
                </div>
                {errors.phone && <p className="formError">{errors.phone.message}</p>}
              </div>
              <div className="formGroup group">
                <Controller name="password" control={control} render={({ field }) => (
                  <PasswordField
                    field={field}
                    id="password"
                    autoComplete="new-password"
                    label="Password"
                    placeholder="Enter Password"
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
                    label="Confirm Password"
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
                <label htmlFor="location" className="formLabel">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim group-focus-within:text-highlight transition-colors" />
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
            <label className={`flex items-center gap-3 px-1 w-fit ${isFormDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              <Controller name="availabilityStatus" control={control} render={({ field }) => (
                <input
                  type="checkbox"
                  {...field}
                  disabled={isFormDisabled}
                  checked={field.value}
                  className="h-4 w-4 accent-highlight rounded"
                />
              )} />
              <span className="text-text-dim text-xs font-bold">Available</span>
            </label>

            {!isLimitReached && <CaptchaField onVerify={setCaptchaToken} />}

            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full bg-highlight hover:bg-highlight/90 text-black font-black uppercase tracking-[0.2em] text-xs py-5 rounded-xl transition-all shadow-[0_10px_30px_rgba(var(--highlight-hex),0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[56px]"
            >
              {isCheckingQuota ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking Quota...
                </>
              ) : isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
          <div className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-[10px] font-bold text-text-dim">
                Already registered?{' '}
                <Link href="/admin/login" className="text-highlight hover:text-white transition-colors font-black uppercase tracking-wider">
                  Login Here
                </Link>
              </p>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em]">Register As</p>
              <div className="flex gap-3">
                <Link href="/patient/register" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all">
                  Patient Register
                </Link>
                <Link href="/donor/register" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/10 transition-all">
                  Donor Register
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;