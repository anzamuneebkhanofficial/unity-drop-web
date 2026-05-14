/** @format */
'use client';

import React, { useState } from 'react';
import { MapPinIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const LocationPicker = ({ onLocationDetected, className = '' }) => {
    const [loading, setLoading] = useState(false);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log(`Detected coords: ${latitude}, ${longitude} (Accuracy: ${accuracy}m)`);

                try {
                    // Industry standard reverse geocoding using OpenStreetMap (Free, Accurate & No Key Required)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                'Accept-Language': 'en',
                                'User-Agent': 'BloodDonorApp-Production/1.0'
                            }
                        }
                    );

                    if (!response.ok) throw new Error('Geocoding service unavailable');

                    const data = await response.json();

                    // Prioritize specific location names
                    const city = data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.hamlet ||
                        data.address.suburb ||
                        data.address.county ||
                        data.address.state ||
                        'Unknown Location';

                    const fullAddress = data.display_name;

                    onLocationDetected({
                        latitude,
                        longitude,
                        address: fullAddress,
                        city: city
                    });

                    toast.success(`Location identified: ${city}`, {
                        description: `Accuracy: within ${Math.round(accuracy)} meters`
                    });
                } catch (error) {
                    console.error('Reverse geocoding error:', error);
                    // Fallback to coordinates only if geocoding fails
                    onLocationDetected({ latitude, longitude, address: '', city: '' });
                    toast.warning('Position detected, but address lookup failed.');
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                setLoading(false);
                let msg = 'Positioning failed';
                let subMsg = 'Please ensure location services are enabled.';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = 'Location Access Denied';
                        subMsg = 'Please enable location permissions in browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = 'Location Unavailable';
                        subMsg = 'Your device could not determine its position.';
                        break;
                    case error.TIMEOUT:
                        msg = 'Detection Timeout';
                        subMsg = 'Took too long to find your location. Try again.';
                        break;
                }

                toast.error(msg, { description: subMsg });
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );
    };

    return (
        <button
            type="button"
            onClick={handleDetectLocation}
            disabled={loading}
            className={`flex items-center space-x-2 text-sm text-highlight/80 hover:text-highlight font-medium transition-colors ${className}`}
        >
            {loading ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
                <MapPinIcon className="w-4 h-4" />
            )}
            <span>{loading ? 'Detecting...' : 'Use current location'}</span>
        </button>
    );
};

export default LocationPicker;
