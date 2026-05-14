/** @format */

'use client';

import { useAdminAuthStore } from '@/store/auth/authAdminStore';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LocationPicker from '@/components/common/LocationPicker';
import { Settings, Save, User, Phone, MapPin, Shield } from 'lucide-react';

const profileSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().required('Phone number is required'),
  location: yup.string().required('Location is required'),
  availabilityStatus: yup.boolean().required('Availability is required'),
  latitude: yup.mixed().optional(),
  longitude: yup.mixed().optional(),
});

const inputClass =
  'w-full bg-[#121212] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-gray-200 placeholder:text-gray-500 appearance-none';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1';
const selectClass = `${inputClass} cursor-pointer`;


export default function AdminProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const {
    AdminCaught: user,
    getAdmin,
    updateProfile,
    loading,
  } = useAdminAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: '',
      gender: '',
      phone: '',
      location: '',
      availabilityStatus: false,
      latitude: '',
      longitude: '',
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
        latitude: user.locationCoordinates?.coordinates?.[1] ?? '',
        longitude: user.locationCoordinates?.coordinates?.[0] ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const dirtyData = {};
    Object.keys(data).forEach((key) => {
      if (key === 'latitude' || key === 'longitude') {
        const coordIndex = key === 'longitude' ? 0 : 1;
        const currentCoord = user.locationCoordinates?.coordinates?.[coordIndex];
        if (data[key] !== currentCoord) {
          dirtyData[key] = data[key];
        }
      } else if (data[key] !== user[key]) {
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
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        {/* Top color bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-highlight opacity-50"></div>

        <div className="p-8 md:p-12">
          {/* Header */}
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
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter full name" />
                    )}
                  />
                </div>
                {errors.fullName && <p className="text-donor text-xs font-semibold mt-2">{errors.fullName.message}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className={labelClass}>Gender</label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={selectClass}>
                      <option value="" disabled className="text-gray-500">Select gender</option>
                      <option value="Male" className="bg-[#1a1a1a]">Male</option>
                      <option value="Female" className="bg-[#1a1a1a]">Female</option>
                      <option value="Other" className="bg-[#1a1a1a]">Other</option>
                    </select>
                  )}
                />
                {errors.gender && <p className="text-donor text-xs font-semibold mt-2">{errors.gender.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter phone number" />
                    )}
                  />
                </div>
                {errors.phone && <p className="text-donor text-xs font-semibold mt-2">{errors.phone.message}</p>}
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className={labelClass}>Location *</label>
                <div className="relative mb-3">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter your city or area" />
                    )}
                  />
                </div>
                <LocationPicker
                  onLocationDetected={({ latitude, longitude, city, address }) => {
                    setValue('latitude', latitude);
                    setValue('longitude', longitude);
                    if (city || address) {
                      setValue('location', city || address);
                    }
                  }}
                />
                {errors.location && <p className="text-donor text-xs font-semibold mt-2">{errors.location.message}</p>}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <label className="flex items-center gap-4 cursor-pointer group bg-[#121212] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                <div className="relative flex items-center">
                  <Controller
                    name="availabilityStatus"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        onChange={(e) => field.onChange(e.target.checked)}
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
              {errors.availabilityStatus && <p className="text-donor text-xs font-semibold mt-2">{errors.availabilityStatus.message}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}