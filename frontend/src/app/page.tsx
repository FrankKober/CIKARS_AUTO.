'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- AnimatedSearch placeholder (replace with your actual component) ---
function AnimatedSearch() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="Search by make, model, or keyword..."
          className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition"
        />
      </div>
      <button className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition whitespace-nowrap">
        Search
      </button>
    </div>
  );
}

// --- Reusable fade-in hook ---
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// --- Featured Car Card ---
function CarCard({ image, title, price, year, mileage, tag }: { image: string; title: string; price: string; year: string; mileage: string; tag?: string }) {
  return (
    <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
      {tag && (
        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider">
          {tag}
        </span>
      )}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-neutral-400 text-sm mb-4">{year} · {mileage}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-white">{price}</span>
          <button className="px-4 py-2 rounded-full border border-white/20 text-sm font-medium hover:bg-white hover:text-black transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Testimonial Card ---
function Testimonial({ name, role, quote, avatar }: { name: string; role: string; quote: string; avatar: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8 hover:bg-white/[0.06] transition">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
          <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-neutral-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-neutral-300 leading-relaxed italic">"{quote}"</p>
      <div className="flex gap-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const categories = ['New', 'Used', 'Lease', 'Electric', 'Luxury', 'Hybrid', 'SUV', 'Sedan'];
  const brands = ['Toyota', 'BMW', 'Audi', 'Porsche', 'Mercedes-Benz', 'Range Rover', 'Tesla', 'Lexus'];

  const featuredCars = [
    {
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop',
      title: 'Porsche 911 Carrera',
      price: '$124,900',
      year: '2024',
      mileage: '2,400 mi',
      tag: 'Featured',
    },
    {
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop',
      title: 'BMW M4 Competition',
      price: '$89,500',
      year: '2023',
      mileage: '8,200 mi',
      tag: 'Hot',
    },
    {
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop',
      title: 'Mercedes-AMG GT',
      price: '$142,000',
      year: '2024',
      mileage: '1,100 mi',
      tag: 'New',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Morgan',
      role: 'Car Enthusiast',
      quote: 'Found my dream 911 within a week. The verification process gave me total confidence in the seller. Best car buying experience ever.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Sarah Chen',
      role: 'First-time Buyer',
      quote: 'The AI pricing insights saved me thousands. I knew exactly what the market value was before I even contacted the seller.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Marcus Johnson',
      role: 'Verified Seller',
      quote: 'Sold my Tesla in 3 days at asking price. The platform attracts serious buyers only — no lowballers or tire kickers.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
  ];

  const steps = [
    { num: '01', title: 'Browse Fleet', desc: 'Explore thousands of verified listings with AI-powered recommendations tailored to you.' },
    { num: '02', title: 'Connect', desc: 'Message sellers directly, schedule test drives, and get detailed vehicle history reports.' },
    { num: '03', title: 'Drive Away', desc: 'Complete secure transactions with our escrow protection and drive home with confidence.' },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white font-sans">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter">
            CIKARS
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="/cars" className="hover:text-white transition">Browse</Link>
            <Link href="/sell" className="hover:text-white transition">Sell</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/careers" className="hover:text-white transition">Careers</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            
            <Link href="/auth" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)]" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02),transparent)]" />

     

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-20 flex flex-col items-center">
        
        <FadeIn>
          <div className="mb-8">
            <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs uppercase tracking-[0.25em] text-neutral-300">
              Cikars — Seek Your Choice
            </span>
          </div>
        </FadeIn>
         {/* Floating Car Images */}
      <div className="hidden xl:block absolute left-[-6%] top-[45%] -translate-y-1/2 w-[420px] h-[320px] opacity-70 hover:opacity-100 transition-opacity duration-500">
        <Image
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop"
          alt="Luxury Car"
          fill
          className="object-cover rounded-3xl shadow-2xl"
          unoptimized
        />
      </div>
      <div className="hidden xl:block absolute right-[-6%] top-[45%] -translate-y-1/2 w-[420px] h-[320px] opacity-70 hover:opacity-100 transition-opacity duration-500">
        <Image
          src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop"
          alt="Sports Car"
          fill
          className="object-cover rounded-3xl shadow-2xl"
          unoptimized
        />
      </div>

        <FadeIn delay={100}>
          <h1 className="text-center text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9]">
            Find your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
              Drive
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="mt-8 text-center max-w-2xl text-neutral-400 text-lg md:text-xl leading-relaxed">
            Buy, sell and discover premium vehicles with verified listings, 
            intelligent recommendations and trusted sellers.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/cars"
              className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Browse Fleet
            </Link>
            <Link
              href="/sell"
              className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition font-medium"
            >
              Sell Your Car
            </Link>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={400}>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 mt-16">
            {[
              { value: '10K+', label: 'Cars Listed' },
              { value: '5K+', label: 'Verified Sellers' },
              { value: '99%', label: 'Trust Score' },
              { value: '<24h', label: 'Avg. Sale Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</h3>
                <p className="text-neutral-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Categories */}
        <FadeIn delay={500}>
          <div className="flex flex-wrap justify-center gap-3 mt-16">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white hover:text-black transition-all duration-300 font-medium text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Search Box */}
        <FadeIn delay={600} className="w-full max-w-4xl mt-16">
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
            <AnimatedSearch />
          </div>
        </FadeIn>
      </div>

      {/* ===== FEATURED LISTINGS ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-3">Curated For You</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Featured Listings</h2>
            </div>
            <Link href="/cars" className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition">
              View All <span className="text-lg">→</span>
            </Link>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car, i) => (
            <FadeIn key={car.title} delay={i * 150}>
              <CarCard {...car} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">How It Works</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 150}>
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-10 hover:bg-white/[0.06] transition group">
                <span className="text-6xl font-black text-white/5 group-hover:text-white/10 transition absolute top-6 right-6">
                  {step.num}
                </span>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== BRAND MARQUEE ===== */}
      <section className="relative z-10 py-16 border-y border-white/5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="mx-12 text-2xl md:text-3xl font-bold text-neutral-600 hover:text-white transition duration-300 cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-3">Why Cikars</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Built for Drivers</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'AI Vehicle Insights', desc: 'Smart pricing analysis and market comparisons for every listing. Never overpay again.', icon: '⚡' },
            { title: 'Verified Sellers', desc: 'Every seller is identity-verified and rated. Buy with total peace of mind.', icon: '✓' },
            { title: 'Fast Transactions', desc: 'Connect with buyers and sellers instantly through our secure messaging platform.', icon: '→' },
            { title: 'Escrow Protection', desc: 'Your money is held safely until you confirm the vehicle is exactly as described.', icon: '🔒' },
            { title: 'Nationwide Delivery', desc: 'Get your car delivered to your door, fully insured, anywhere in the country.', icon: '🚚' },
            { title: '24/7 Support', desc: 'Our concierge team is available around the clock to help with any questions.', icon: '💬' },
          ].map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 100}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8 hover:border-white/20 transition group">
                <div className="text-3xl mb-4 opacity-60 group-hover:opacity-100 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-3">Community</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Loved by Drivers</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 150}>
              <Testimonial {...t} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== CTA / NEWSLETTER ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <FadeIn>
          <div className="rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
              Ready to find your<br />perfect drive?
            </h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-10">
              Join 50,000+ car enthusiasts. Get exclusive listings and market alerts delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition"
              />
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition whitespace-nowrap">
                Join Free
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="text-3xl font-black tracking-tighter block mb-4">
                CIKARS
              </Link>
              <p className="text-neutral-500 max-w-sm leading-relaxed">
                The premium marketplace for buying and selling verified vehicles. Trusted by thousands of drivers worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3 text-neutral-500 text-sm">
                <li><Link href="/cars" className="hover:text-white transition">Browse Cars</Link></li>
                <li><Link href="/sell" className="hover:text-white transition">Sell Your Car</Link></li>
                <li><Link href="/dealers" className="hover:text-white transition">For Dealers</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-neutral-500 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 text-sm">
            <p>© 2026 Cikars. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Marquee Animation Styles */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  );
}