'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../lib/api';

export default function SellCarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '', 
    location: '', description: '', fuelType: '', 
    transmission: '', vin: '', images: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Retrieve token for the authorized request
    const authData = localStorage.getItem('tasky-auth');
    const token = authData ? JSON.parse(authData).token : null;

    try {
      await apiRequest('/cars', { 
        method: 'POST', 
        body: JSON.stringify(formData),
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setToast('Listing successfully published!');
      
      // Redirect to Browse Cars page after 2 seconds
      setTimeout(() => {
        router.push('/cars');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-16 flex flex-col items-center">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-10 bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold shadow-2xl z-50 animate-bounce">
          {toast}
        </div>
      )}

      <div className="w-full max-w-xl">
        {/* Progress Timeline */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${step >= num ? 'bg-white text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-600'}`}>
                {num}
              </div>
              <span className="text-[10px] mt-2 uppercase tracking-widest text-neutral-500">
                {num === 1 ? 'Core' : num === 2 ? 'Specs' : num === 3 ? 'Media' : 'Final'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm">
          {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-xl text-sm">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Core Metrics</h3>
              <input type="text" name="make" required placeholder="Make (e.g. Toyota)" value={formData.make} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              <input type="text" name="model" required placeholder="Model (e.g. Land Cruiser)" value={formData.model} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="year" required placeholder="Year" value={formData.year} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
                <input type="text" name="vin" required placeholder="VIN Number" value={formData.vin} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Specifications</h3>
              <input type="number" name="mileage" required placeholder="Mileage (KM)" value={formData.mileage} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              <input type="number" name="price" required placeholder="Asking Price (KES)" value={formData.price} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="fuelType" required placeholder="Fuel Type" value={formData.fuelType} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
                <input type="text" name="transmission" required placeholder="Transmission" value={formData.transmission} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Location & Media</h3>
              <input type="text" name="location" required placeholder="Location (e.g. Nairobi)" value={formData.location} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
              <input type="text" name="images" required placeholder="Image URLs (comma separated)" value={formData.images} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Final Overview</h3>
              <textarea name="description" required rows={6} placeholder="Describe the vehicle condition, history, and key features..." value={formData.description} onChange={handleChange} className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl outline-none focus:border-white transition resize-none" />
            </div>
          )}

          <div className="flex justify-between pt-10 mt-6 border-t border-neutral-800">
            <button type="button" onClick={prevStep} disabled={step === 1} className="text-neutral-500 hover:text-white disabled:opacity-0">Back</button>
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200">Continue</button>
            ) : (
              <button type="submit" disabled={loading} className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400">{loading ? 'Publishing...' : 'Submit Listing'}</button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}