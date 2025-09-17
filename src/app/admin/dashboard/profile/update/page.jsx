/** @format */

'use client';

import { useAdminAuthStore } from '@/store/auth/auth-admin-store';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const profileSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().required('Phone number is required'),
  availabilityStatus: yup.boolean().required('Availability is required'),
});

const inputClass =
  'w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400';
const buttonClass =
  'w-full bg-yellow-400 py-3 rounded-lg font-medium text-black hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed';

export default function AdminProfilePage() {
  const router = useRouter();
  const {
    AdminCaught: user,
    getAdmin,
    updateProfile,
    loading,
    error,
    success,
    resetMessages,
  } = useAdminAuthStore();
  //   console.log('user CAUGHT', user.gender);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: '',
      gender: '',
      phone: '',
      availabilityStatus: false,
    },
  });
  // Load user into form once fetched
  useEffect(() => {
    getAdmin();
  }, [getAdmin]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user?.fullName || '',
        gender: user?.gender || '',
        phone: user?.phone || '',
        availabilityStatus: user?.availabilityStatus,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);

    if (success || error) {
      reset();
      resetMessages();
    }
  }, [success, error, reset, resetMessages]);

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (reset) router.push('/admin/dashboard');
    // console.log('result', result);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Admin Profile
        </h2>
        <p className="text-sm text-gray-400 text-center">
          Update your account details below
        </p>

        {/* Full Name */}
        <div>
          <label className="block text-gray-400 mb-1">Full Name</label>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className={inputClass} />
            )}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-400 mb-1">Gender</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select {...field} className={inputClass}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-400 mb-1">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className={inputClass} />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <Controller
            name="availabilityStatus"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                checked={field.value}
                className="w-5 h-5 accent-yellow-400"
              />
            )}
          />
          <label className="text-gray-400">Available for donation</label>
        </div>
        {errors.availabilityStatus && (
          <p className="text-red-500 text-sm">
            {errors.availabilityStatus.message}
          </p>
        )}

        {/* Submit Button */}
        <button type="submit" className={buttonClass} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
