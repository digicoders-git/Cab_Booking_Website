import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, User, Car, ShieldCheck } from 'lucide-react';

const customCarIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Generic car icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

// Component to dynamically recenter map on driver
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 15, { animate: true });
        }
    }, [lat, lng, map]);
    return null;
};

const PublicTracking = () => {
    const { id } = useParams();
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTrackingData = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${API_BASE_URL}/trips/public/track/${id}`);
            
            if (res.data.success) {
                setTrackingData(res.data.bookingDetails);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error tracking ride. The ride might have ended or is invalid.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingData();
        // Poll every 10 seconds for updated location
        const interval = setInterval(fetchTrackingData, 10000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading && !trackingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium animate-pulse">Connecting to Live Map...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
                    <ShieldCheck className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Tracking Unavailable</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <p className="text-sm text-gray-400">For security reasons, tracking is only available while the ride is active.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col max-w-3xl mx-auto md:py-8 shadow-2xl">
            
            {/* Header */}
            <div className="bg-blue-600 text-white p-5 md:rounded-t-2xl flex items-center justify-between shadow-md z-10 relative">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="text-blue-200" /> Live Ride Tracking
                    </h1>
                    <p className="text-blue-100 text-sm mt-1">
                        Tracking {trackingData.passengerName}'s Ride
                    </p>
                </div>
                <div className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2"></span>
                    LIVE
                </div>
            </div>

            {/* Map Area */}
            <div className="w-full h-[50vh] md:h-[400px] relative z-0">
                {trackingData?.location?.latitude && trackingData?.location?.longitude ? (
                    <MapContainer 
                        center={[trackingData.location.latitude, trackingData.location.longitude]} 
                        zoom={15} 
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker 
                            position={[trackingData.location.latitude, trackingData.location.longitude]} 
                            icon={customCarIcon}
                        >
                            <Popup>Driver is here</Popup>
                        </Marker>
                        <RecenterMap lat={trackingData.location.latitude} lng={trackingData.location.longitude} />
                    </MapContainer>
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 font-medium">Waiting for driver's GPS signal...</p>
                    </div>
                )}
            </div>

            {/* Ride Details Card */}
            <div className="bg-white p-6 md:rounded-b-2xl shadow-md z-10 relative -mt-4 mx-4 md:mx-0 rounded-2xl md:rounded-t-none">
                
                {/* Driver Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <User size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Assigned Driver</p>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{trackingData.driverDetails?.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{trackingData.driverDetails?.phone}</p>
                    </div>
                    <div className="text-right border-l border-gray-200 pl-4">
                        <Car size={20} className="text-gray-400 mx-auto mb-1" />
                        <p className="text-[10px] uppercase font-bold text-gray-500">{trackingData.driverDetails?.carModel}</p>
                        <p className="font-bold text-gray-900 text-sm bg-yellow-100 px-2 py-0.5 rounded mt-0.5">
                            {trackingData.driverDetails?.carNumber}
                        </p>
                    </div>
                </div>

                {/* Route Info */}
                <div className="space-y-4 relative before:absolute before:inset-y-5 before:left-[11px] before:w-[2px] before:bg-gray-200">
                    <div className="flex items-start gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Pickup Location</p>
                            <p className="text-sm font-semibold text-gray-900 leading-snug">{trackingData.pickup}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_white]">
                            <MapPin size={12} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Drop Location</p>
                            <p className="text-sm font-semibold text-gray-900 leading-snug">{trackingData.drop}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 font-medium">This tracking link is secure and will automatically expire once the ride is completed.</p>
                </div>
            </div>

        </div>
    );
};

export default PublicTracking;
