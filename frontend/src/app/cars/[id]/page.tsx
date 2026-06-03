'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '../../lib/api';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function CarDetailsPage() {
  const params = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCarDetails(params.id as string);
    }
  }, [params.id]);

  const fetchCarDetails = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiRequest(`/cars/${id}`);
      setCar(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neutral-800 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-neutral-500 font-semibold tracking-widest uppercase text-sm">Loading Telemetry...</p>
        </div>
      </main>
    );
  }

  if (error || !car) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-md text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Telemetry Lost</h2>
          <p className="text-neutral-400 text-sm mb-6">{error || 'Vehicle record not found.'}</p>
          <a href="/cars" className="inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-neutral-200 transition">
            Return to Fleet
          </a>
        </div>
      </main>
    );
  }

  // Chart Data Preparation
  const marketAverage = car.intelligence?.marketAveragePrice || car.price * 1.1; // Fallback math if AI hasn't processed
  const chartData = [
    { name: 'Listed Price', value: car.price },
    { name: 'Market Avg', value: marketAverage },
  ];

  const getScoreColor = (score: string) => {
    if (score === 'GREAT_DEAL') return 'text-emerald-400 bg-emerald-950 border-emerald-800';
    if (score === 'FAIR_PRICE') return 'text-blue-400 bg-blue-950 border-blue-800';
    return 'text-amber-400 bg-amber-950 border-amber-800';
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-neutral-900 border-b border-neutral-800">
        <Image 
          src={car.images?.[0] || '/placeholder-image.jpg'} 
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover opacity-90"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md">
              {car.year}
            </span>
            <span className="text-neutral-300 text-sm font-medium tracking-widest uppercase">
              {car.make}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
            {car.model}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Vehicle Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Core Specs */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
              <p className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-1">Mileage</p>
              <p className="text-xl font-bold">{car.mileage.toLocaleString()} km</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
              <p className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-1">Transmission</p>
              <p className="text-xl font-bold">{car.transmission || 'Auto'}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
              <p className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-1">Fuel Type</p>
              <p className="text-xl font-bold">{car.fuelType || 'Petrol'}</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
              <p className="text-neutral-500 text-xs font-bold tracking-wider uppercase mb-1">Location</p>
              <p className="text-xl font-bold">{car.location}</p>
            </div>
          </section>

          {/* AI Narrative */}
          {car.intelligence?.aiSummary && (
            <section className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32 text-white">
                  <path d="M9.318 3.182a4.5 4.5 0 016.364 0 .75.75 0 01-1.06 1.06 3 3 0 00-4.243 0 .75.75 0 01-1.06-1.06zM6.664 5.836a8.25 8.25 0 0110.672 0 .75.75 0 01-1.06 1.06 6.75 6.75 0 00-8.552 0 .75.75 0 01-1.06-1.06zM3.485 9.015A12.75 12.75 0 0120.515 9.015a.75.75 0 01-1.06 1.06 11.25 11.25 0 00-14.91 0 .75.75 0 01-1.06-1.06zM12 12.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                AI Market Analysis
              </h3>
              <p className="text-neutral-300 leading-relaxed text-lg italic">
                "{car.intelligence.aiSummary}"
              </p>
            </section>
          )}

          {/* Description */}
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-4 text-white">Vehicle Narrative</h3>
            <div className="prose prose-invert max-w-none text-neutral-400 leading-loose">
              {car.description || 'No detailed narrative provided for this vehicle.'}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Pricing & Action Engine */}
        <div className="space-y-6">
          
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl sticky top-24 shadow-2xl">
            <p className="text-neutral-500 text-sm font-bold tracking-wider uppercase mb-2">Listed Price</p>
            <h2 className="text-5xl font-black tracking-tighter mb-4">
              <span className="text-2xl text-neutral-400 mr-1">KES</span>
              {car.price.toLocaleString()}
            </h2>

            {/* Dynamic AI Score Badge */}
            {car.intelligence?.fairPriceScore && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-wider mb-8 ${getScoreColor(car.intelligence.fairPriceScore)}`}>
                {car.intelligence.fairPriceScore.replace('_', ' ')}
              </div>
            )}

            {/* AI Pricing Chart */}
            <div className="h-48 w-full mb-8 mt-4">
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-4 text-center">Market Comparison</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                    formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, '']}
                  />
                  <YAxis hide domain={['dataMin - 500000', 'dataMax + 500000']} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#fff' : '#333'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.15)] mb-3">
              Contact Seller
            </button>
            <button className="w-full bg-transparent border border-neutral-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 transition">
              Save to Favorites
            </button>

            {/* Seller Trust Badge */}
            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-neutral-400">
                  {car.seller?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{car.seller?.name || 'Verified Seller'}</p>
                  <p className="text-xs text-neutral-500">Member since 2026</p>
                </div>
              </div>
              {car.seller?.verified && (
                <span className="bg-blue-950 text-blue-400 p-1.5 rounded-full border border-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}