'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SellCarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submittedImages, setSubmittedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '', 
    location: '', description: '', fuelType: '', 
    transmission: '', vin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      // Generate previews
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ─── TOKEN EXTRACTION ───
    let token: string | null = null;
    const authData = localStorage.getItem('tasky-auth');

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        token = parsed.state?.token 
             || parsed.token 
             || parsed.data?.token 
             || parsed.user?.token 
             || parsed.accessToken 
             || null;
      } catch (e) {
        console.error('Auth parsing error:', e);
      }
    }

    // Fallback keys
    if (!token) {
      const fallbacks = ['token', 'access_token', 'auth_token', 'jwt', 'user'];
      for (const key of fallbacks) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            token = parsed.token || parsed.accessToken || parsed.state?.token || raw;
            if (token) break;
          } catch {
            token = raw;
            break;
          }
        }
      }
    }

    // Cookie fallback
    if (!token) {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      if (match) token = decodeURIComponent(match[1]);
    }

    if (!token) {
      setError('Authentication error: Please log in again.');
      setLoading(false);
      return;
    }

    // ─── FORM SUBMISSION ───
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value.toString());
    });

    files.forEach((file) => data.append('images', file));

    try {
      const response = await fetch('http://localhost:3001/cars', {
        method: 'POST',
        body: data,
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please log out and log back in.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to publish listing.');
      }

      const result = await response.json();
      console.log('Server response:', result);

      // Store returned image URLs to display them
      if (result.images && Array.isArray(result.images)) {
        setSubmittedImages(result.images);
      }

      setToast('Listing successfully published!');
      setTimeout(() => router.push('/cars'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identity', desc: 'Make & Model' },
    { id: 2, title: 'Specs', desc: 'Usage & Price' },
    { id: 3, title: 'Location & Media', desc: 'Photos & Address' },
    { id: 4, title: 'Review', desc: 'Final Overview' },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 flex flex-col items-center">
      {toast && (
        <div className="fixed top-6 right-6 bg-emerald-500 text-black px-6 py-3 rounded-2xl font-bold z-50 animate-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      <div className="w-full max-w-2xl">
        <div className="mb-16 space-y-2">
          <h1 className="text-4xl font-black">Sell Your Vehicle</h1>
          <p className="text-neutral-500">Provide accurate details to get the best AI valuation.</p>
        </div>

        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-px bg-neutral-800 -z-10" />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${step >= s.id ? 'bg-white text-black' : 'bg-black border-neutral-800 text-neutral-600'}`}>
                {s.id}
              </div>
              <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-neutral-400">{s.title}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl">
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

          {/* SUCCESS STATE - Show uploaded images */}
          {submittedImages.length > 0 && (
            <div className="mb-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h3 className="text-emerald-400 font-bold mb-3">✓ Listing Published Successfully!</h3>
              <p className="text-neutral-400 text-sm mb-4">Your vehicle images:</p>
              <div className="grid grid-cols-3 gap-3">
                {submittedImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-500/30">
                    <Image 
                      src={img} 
                      alt={`Uploaded ${i + 1}`} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              <p className="text-neutral-500 text-xs mt-3">Redirecting to listings page...</p>
            </div>
          )}

          <div className="min-h-75">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <input name="make" placeholder="Make (e.g. Toyota)" value={formData.make} onChange={handleChange} className="col-span-2 p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none transition" required />
                <input name="model" placeholder="Model (e.g. Land Cruiser)" value={formData.model} onChange={handleChange} className="col-span-2 p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none transition" />
                <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} className="p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none" required />
                <input name="vin" placeholder="VIN Number" value={formData.vin} onChange={handleChange} className="p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none" required />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <input name="mileage" type="number" placeholder="Mileage (KM)" value={formData.mileage} onChange={handleChange} className="p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none" required />
                <input name="price" type="number" placeholder="Price (KES)" value={formData.price} onChange={handleChange} className="p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none" required />
                <input name="fuelType" placeholder="Fuel (e.g. Petrol)" value={formData.fuelType} onChange={handleChange} className="p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none" />
                <input name="transmission" placeholder="Transmission" value={formData.transmission} onChange={handleChange} className="p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none" />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <input name="location" placeholder="Location (e.g. Nairobi)" value={formData.location} onChange={handleChange} className="w-full p-4 bg-black border border-neutral-800 rounded-xl focus:border-white outline-none transition" required />
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-neutral-800 rounded-2xl p-8 text-center hover:border-neutral-600 transition">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="fileInput" 
                  />
                  <label htmlFor="fileInput" className="cursor-pointer text-neutral-400 block">
                    <span className="block text-4xl mb-4">📷</span>
                    <span className="font-bold text-white">Upload Vehicle Photos</span>
                    <p className="text-sm mt-2">Select multiple files from your device</p>
                  </label>
                  {files.length > 0 && (
                    <p className="mt-4 text-emerald-400 font-bold">{files.length} file(s) selected</p>
                  )}
                </div>

                {/* Image Previews */}
                {previews.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-3">Selected Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {previews.map((preview, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group">
                          <Image 
                            src={preview} 
                            alt={`Preview ${i + 1}`} 
                            fill 
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Add a professional narrative for the AI analysis..." 
                  className="w-full h-48 p-6 bg-black border border-neutral-800 rounded-2xl focus:border-white outline-none transition" 
                  required 
                />
                
                {/* Review summary */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-2 text-sm">
                  <p><span className="text-neutral-500">Vehicle:</span> {formData.make} {formData.model} ({formData.year})</p>
                  <p><span className="text-neutral-500">Price:</span> KES {formData.price}</p>
                  <p><span className="text-neutral-500">Location:</span> {formData.location}</p>
                  <p><span className="text-neutral-500">Photos:</span> {files.length} image(s)</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-8 mt-8 border-t border-neutral-800">
            <button type="button" onClick={prevStep} disabled={step === 1} className="text-neutral-500 hover:text-white transition disabled:opacity-0">Back</button>
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition">Continue</button>
            ) : (
              <button type="submit" disabled={loading} className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition">
                {loading ? 'Publishing...' : 'Submit Listing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}