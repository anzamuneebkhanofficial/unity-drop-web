
'use client';

import { useEffect, useState } from 'react';
import { usePatientAuthStore } from '@/store/auth/authPatientStore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { Settings, Save, User, Phone, MapPin, Droplet, Building2 } from 'lucide-react';

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
  address: yup.string().optional(),
  hospitalName: yup.string().optional(),
  hospitalAddress: yup.string().optional(),
  hospitalLocation: yup.string().optional(),
});



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
    formState: { errors, isSubmitting },
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-highlight to-highlight/50 opacity-50"></div>

        <div className="p-8 md:p-12">

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
              type="submit"
              form="profile-form"
              disabled={isSubmitting || loading}
              className="flex items-center justify-center gap-2 bg-highlight hover:bg-highlight/80 text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(253,199,0,0.2)]"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" /> Personal Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="fullName" className="dashboard-label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter full name"
                        />
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
                  <label htmlFor="bloodGroup" className="dashboard-label">Blood Group</label>
                  <div className="relative">
                    <Droplet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <select {...field} id="bloodGroup" disabled={loading} className="dashboard-input dashboard-select pl-14">
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
                <div>
                  <label htmlFor="phone" className="dashboard-label">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter phone number"
                        />
                      )}
                    />
                  </div>
                  {errors.phone && <p className="text-donor text-xs font-semibold mt-2">{errors.phone.message}</p>}
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-500" /> Location & Hospital Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label htmlFor="location" className="dashboard-label">Location *</label>
                  <div className="relative mb-3">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="location"
                          type="text"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter your city or area"
                        />
                      )}
                    />
                  </div>
                  {errors.location && <p className="text-donor text-xs font-semibold mt-2">{errors.location.message}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="dashboard-label">Home Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="address"
                          type="text"
                          autoComplete="street-address"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter your address"
                        />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hospitalName" className="dashboard-label">Hospital Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="hospitalName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="hospitalName"
                          type="text"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter hospital name"
                        />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hospitalAddress" className="dashboard-label">Hospital Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="hospitalAddress"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="hospitalAddress"
                          type="text"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter hospital address"
                        />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hospitalLocation" className="dashboard-label">Hospital City</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <Controller
                      name="hospitalLocation"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="hospitalLocation"
                          type="text"
                          disabled={loading}
                          className="dashboard-input pl-14"
                          placeholder="Enter hospital city"
                        />
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