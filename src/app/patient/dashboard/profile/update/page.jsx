/** @format */

'use client';

import { useEffect } from 'react';
import { usePatientAuthStore } from '@/store/auth/auth-patient-store';
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
  address: yup.string(),
  hospitalName: yup.string(),
  hospitalAddress: yup.string(),
  hospitalLocation: yup.string(),
});

const inputClass =
  'w-full p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400';
const buttonClass =
  'w-full bg-yellow-400 py-3 rounded-lg font-medium text-black hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed';

export default function PatientProfilePage() {
  const router = useRouter();

  const {
    PatientCaught: user,
    getPatient,
    updateProfile,
    loading,
    error,
    success,
    resetMessages,
  } = usePatientAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: 'No data found',
      gender: '',
      phone: 'No data found',
      location: 'No data found',
      bloodGroup: '',
      availabilityStatus: false,
      address: 'No data found',
      hospitalName: 'No data found',
      hospitalAddress: 'No data found',
      hospitalLocation: 'No data found',
    },
  });

  useEffect(() => {
    getPatient();
  }, [getPatient]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || 'No data found',
        gender: user.gender || '',
        phone: user.phone || 'No data found',
        location: user.location || 'No data found',
        bloodGroup: user.bloodGroup || '',
        availabilityStatus: user.availabilityStatus,
        address: user.address || 'No data found',
        hospitalName: user.hospitalName || 'No data found',
        hospitalAddress: user.hospitalAddress || 'No data found',
        hospitalLocation: user.hospitalLocation || 'No data found',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result) router.push('/patient/dashboard');
  };

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
    if (success || error) resetMessages();
  }, [success, error, resetMessages]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Patient Profile
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

        {/* Optional Fields */}
        <FormInput
          name="address"
          control={control}
          label="Address"
          errors={errors}
        />
        <FormInput
          name="hospitalName"
          control={control}
          label="Hospital Name"
          errors={errors}
        />
        <FormInput
          name="hospitalAddress"
          control={control}
          label="Hospital Address"
          errors={errors}
        />
        <FormInput
          name="hospitalLocation"
          control={control}
          label="Hospital Location"
          errors={errors}
        />

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
          <input
            {...field}
            type="text"
            className={inputClass}
            placeholder="No data found"
          />
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </div>
  );
}
