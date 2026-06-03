'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '../lib/api';
import { useRouter } from 'next/navigation';


interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  images: string[];
  intelligence?: {
    fairPriceScore: 'GREAT_DEAL' | 'FAIR_PRICE' | 'OVERPRICED';
    aiSummary: string;
  };
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [make, setMake] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchCars();
  }, [make, maxPrice]);

  const fetchCars = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (make) params.append('make', make);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const query = params.toString() ? `?${params.toString()}` : '';

      const data = await apiRequest(`/cars${query}`);

      setCars(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Explore Available Fleet
          </h1>
          <p className="text-neutral-400 mt-2">
            Premium vehicles analyzed and verified by AI metrics.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Filter by Make..."
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-neutral-600"
          />

          <input
            type="number"
            placeholder="Max Budget (KES)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-neutral-600"
          />
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-500 rounded-xl text-red-300">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-neutral-900 rounded-2xl" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl text-neutral-500">
            No vehicles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <Link
                href={`/cars/${car.id}`}
                key={car.id}
                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition"
              >
                <div className="relative w-full h-48 bg-neutral-950 overflow-hidden">
                  {car.images?.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      No Image Available
                    </div>
                  )}

                  {car.intelligence?.fairPriceScore && (
                    <span
                      className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        car.intelligence.fairPriceScore === 'GREAT_DEAL'
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-blue-950 text-blue-400'
                      }`}
                    >
                      {car.intelligence.fairPriceScore.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold">
                    {car.make} {car.model}
                  </h3>

                  <p className="text-xs text-neutral-500 mb-4">
                    {car.year} • {car.mileage.toLocaleString()} km
                  </p>

                  {car.intelligence?.aiSummary && (
                    <p className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded-lg mb-4 italic line-clamp-2">
                      "{car.intelligence.aiSummary}"
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
                    <span className="text-lg font-black">
                      KES {car.price.toLocaleString()}
                    </span>

                    <span className="text-xs font-semibold bg-neutral-800 px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:text-black transition">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}