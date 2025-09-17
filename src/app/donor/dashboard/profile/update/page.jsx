/** @format */

'use client';

import { useEffect } from 'react';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const profileSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().required('Phone number is required'),
  location: yup.string().required('Location is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  availabilityStatus: yup.boolean().required('Availability is required'),
});

const inputClass =
  'w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400';
const buttonClass =
  'w-full bg-yellow-400 py-3 rounded-lg font-medium text-black hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed';

export default function DonorProfilePage() {
  const router = useRouter(); // ✅ Move hook to top level

  const {
    DonorCaught: user,
    getDonor,
    updateProfile,
    loading,
    error,
    success,
    resetMessages,
  } = useDonorAuthStore();

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
      location: '',
      bloodGroup: '',
      availabilityStatus: false,
    },
  });

  // Load donor data
  useEffect(() => {
    getDonor();
  }, [getDonor]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user?.fullName || '',
        gender: user?.gender || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bloodGroup: user?.bloodGroup || '',
        availabilityStatus: user?.availabilityStatus,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const result = await updateProfile(data); // ✅ do NOT call hooks here
    if (result) router.push('/donor/dashboard'); // ✅ use router from top level
  };

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);

    if (success || error) {
      resetMessages();
    }
  }, [success, error, resetMessages]);

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
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Donor Profile
        </h2>
        <p className="text-sm text-gray-400 text-center">
          Update your account details below
        </p>

        {/* Full Name */}
        <FormInput
          name="fullName"
          control={control}
          label="Full Name"
          errors={errors}
        />

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
                <option value="Other">Other</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Phone */}
        <FormInput
          name="phone"
          control={control}
          label="Phone"
          errors={errors}
        />

        {/* Location */}
        <FormInput
          name="location"
          control={control}
          label="Location"
          errors={errors}
        />

        {/* Blood Group */}
        <div>
          <label className="block text-gray-400 mb-1">Blood Group</label>
          <Controller
            name="bloodGroup"
            control={control}
            render={({ field }) => (
              <select {...field} className={inputClass}>
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
            )}
          />
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>
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

        <button type="submit" className={buttonClass} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

// Reusable Input Component
function FormInput({ name, control, label, errors }) {
  return (
    <div>
      <label className="block text-gray-400 mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input {...field} type="text" className={inputClass} />
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </div>
  );
}
