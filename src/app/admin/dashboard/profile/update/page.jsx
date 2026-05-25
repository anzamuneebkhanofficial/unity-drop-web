
'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Settings, Save, User, Phone, MapPin } from 'lucide-react';

const profileSchema = yup.object().shape({
  fullName: yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Full name must contain only alphabets and spaces')
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone must be between 10 and 15 digits and contain only numbers')
    .required('Phone number is required'),
  location: yup.string().required('Location is required'),
  availabilityStatus: yup.boolean().required('Availability is required'),
});



export default function AdminProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { AdminCaught: user, getAdmin, updateProfile, loading } = useAdminAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: '',
      gender: '',
      phone: '',
      location: '',
      availabilityStatus: false,
    },
  });

  useEffect(() => {
    setMounted(true);
    getAdmin();
  }, [getAdmin]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user?.fullName || '',
        gender: user?.gender || '',
        phone: user?.phone || '',
        location: user?.location || '',
        availabilityStatus: !!user?.availabilityStatus,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const dirtyData = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== user[key]) {
        dirtyData[key] = data[key];
      }
    });

    if (Object.keys(dirtyData).length === 0) {
      toast.info('No changes detected');
      return;
    }

    const result = await updateProfile(dirtyData);
    if (result) {
      router.replace('/admin/dashboard/profile');
    }
  };

  if (!mounted) return null;

  if (!user && loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse">
        Loading details...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-highlight opacity-50"></div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-blue-500">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase">Edit Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Update your profile information</p>
              </div>
            </div>

            <button
              type="submit"
              form="admin-profile-form"
              disabled={isSubmitting || loading}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <form id="admin-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="fullName" className="dashboard-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <input {...field} id="fullName" type="text" autoComplete="name" disabled={loading} className="dashboard-input pl-14" placeholder="Enter full name" />
                    )}
                  />
                </div>
                {errors.fullName && <p className="text-donor text-xs font-semibold mt-2">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="dashboard-label">Gender</label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select {...field} id="gender" disabled={loading} className="dashboard-input dashboard-select">
                      <option value="" disabled className="text-gray-500">Select gender</option>
                      <option value="Male" className="bg-[#1a1a1a]">Male</option>
                      <option value="Female" className="bg-[#1a1a1a]">Female</option>
                      <option value="Other" className="bg-[#1a1a1a]">Other</option>
                    </select>
                  )}
                />
                {errors.gender && <p className="text-donor text-xs font-semibold mt-2">{errors.gender.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="dashboard-label">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input {...field} id="phone" type="tel" autoComplete="tel" disabled={loading} className="dashboard-input pl-14" placeholder="Enter phone number" />
                    )}
                  />
                </div>
                {errors.phone && <p className="text-donor text-xs font-semibold mt-2">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className="dashboard-label">Location</label>
                <div className="relative mb-3">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <input {...field} id="location" type="text" autoComplete="street-address" disabled={loading} className="dashboard-input pl-14" placeholder="Enter your city or area" />
                    )}
                  />
                </div>
                {errors.location && <p className="text-donor text-xs font-semibold mt-2">{errors.location.message}</p>}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <label className="flex items-center gap-4 cursor-pointer group bg-[#121212] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                <div className="relative flex items-center">
                  <Controller
                    name="availabilityStatus"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="availabilityStatus"
                        disabled={loading}
                        checked={field.value}
                        className="peer sr-only"
                      />
                    )}
                  />
                  <div className="w-14 h-7 bg-[#1a1a1a] rounded-full peer peer-checked:bg-green-500/20 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-gray-500 rounded-full peer-checked:translate-x-7 peer-checked:bg-green-500 transition-transform"></div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider">Available for Duties</div>
                  <div className="text-xs text-gray-500 mt-1">Turn on to show you are available for admin duties.</div>
                </div>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}