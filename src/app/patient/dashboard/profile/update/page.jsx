/** @format */

'use client';

import { useEffect, useState } from 'react';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LocationPicker from '@/components/common/LocationPicker';
import { useRouter } from 'next/navigation';
import { Settings, Save, User, Phone, MapPin, Droplet, Building2 } from 'lucide-react';

const profileSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().required('Phone number is required'),
  location: yup.string().required('Location is required'),
  address: yup.string().optional(),
  hospitalName: yup.string().optional(),
  hospitalAddress: yup.string().optional(),
  hospitalLocation: yup.string().optional(),
  latitude: yup.mixed().optional(),
  longitude: yup.mixed().optional(),
});

const inputClass =
  'w-full bg-[#121212] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-highlight/50 transition-all text-gray-200 placeholder:text-gray-500 appearance-none';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1';
const selectClass = `${inputClass} cursor-pointer`;

const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientProfileUpdatePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const {
    PatientCaught: user,
    getPatient,
    updateProfile,
    loading,
  } = usePatientAuthStore();

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
      bloodGroup: '',
      address: '',
      hospitalName: '',
      hospitalAddress: '',
      hospitalLocation: '',
      latitude: '',
      longitude: '',
    },
  });

  useEffect(() => {
    setMounted(true);
    getPatient();
  }, [getPatient]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        gender: user.gender || '',
        phone: user.phone || '',
        location: user.location || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || '',
        hospitalName: user.hospitalName || '',
        hospitalAddress: user.hospitalAddress || '',
        hospitalLocation: user.hospitalLocation || '',
        latitude: user.locationCoordinates?.coordinates?.[1] ?? '',
        longitude: user.locationCoordinates?.coordinates?.[0] ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result) {
      router.replace('/patient/dashboard/profile');
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-highlight to-highlight/50 opacity-50"></div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/5 flex items-center justify-center text-highlight">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase">Edit Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Update your profile and medical information</p>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-highlight hover:bg-highlight/80 text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(253,199,0,0.2)]"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

            {/* Personal Info Section */}
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" /> Personal Info
              </h3>
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

                {/* Blood Group */}
                <div>
                  <label className={labelClass}>Blood Group</label>
                  <div className="relative">
                    <Droplet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <select {...field} className={`${selectClass} pl-14`}>
                          <option value="" disabled className="text-gray-500">Select blood group</option>
                          {validBloodGroups.map((bg) => (
                            <option key={bg} value={bg} className="bg-[#1a1a1a]">{bg}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  {errors.bloodGroup && <p className="text-donor text-xs font-semibold mt-2">{errors.bloodGroup.message}</p>}
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
              </div>
            </div>

            {/* Location & Hospital Section */}
            <div className="pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-500" /> Location & Hospital Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      if (city) setValue('location', city);
                      if (address) setValue('address', address);
                    }}
                  />
                  {errors.location && <p className="text-donor text-xs font-semibold mt-2">{errors.location.message}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className={labelClass}>Home Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter your address" />
                      )}
                    />
                  </div>
                </div>

                {/* Hospital Name */}
                <div>
                  <label className={labelClass}>Hospital Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="hospitalName"
                      control={control}
                      render={({ field }) => (
                        <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter hospital name" />
                      )}
                    />
                  </div>
                </div>

                {/* Hospital Address */}
                <div>
                  <label className={labelClass}>Hospital Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="hospitalAddress"
                      control={control}
                      render={({ field }) => (
                        <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter hospital address" />
                      )}
                    />
                  </div>
                </div>

                {/* Hospital Location */}
                <div>
                  <label className={labelClass}>Hospital City</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="hospitalLocation"
                      control={control}
                      render={({ field }) => (
                        <input {...field} type="text" className={`${inputClass} pl-14`} placeholder="Enter hospital city" />
                      )}
                    />
                  </div>
                </div>

              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}