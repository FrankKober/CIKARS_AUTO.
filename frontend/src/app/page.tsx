'use client';

import { link } from 'fs';
import AnimatedSearch from './components/AnimatedSearch';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const categories = [
    'New',
    'Used',
    'Lease',
    'Electric',
    'Luxury',
    'Hybrid',
  ];

  const brands = [
    'Toyota',
    'BMW',
    'Audi',
    'Porsche',
    'Mercedes-Benz',
    'Range Rover',
  ];

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-black text-white">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)]" />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-[150px]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02),transparent)]" />

      {/* Floating Car Images */}

      <div className="hidden xl:block absolute left-[-8%] top-[48%] -translate-y-1/2 w-[450px] h-[340px] opacity-80">
        <Image
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop"
          alt="Luxury Car"
          fill
          className="object-cover rounded-3xl shadow-2xl"
          unoptimized
        />
      </div>

      <div className="hidden xl:block absolute right-[-8%] top-[48%] -translate-y-1/2 w-[450px] h-[340px] opacity-80">
        <Image
          src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop"
          alt="Sports Car"
          fill
          className="object-cover rounded-3xl shadow-2xl"
          unoptimized
        />
      </div>

      {/* Main Content */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center">

        {/* Badge */}

        <div className="mb-8">
          <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs uppercase tracking-[0.25em] text-neutral-300">
            Cikars, seek your choice in our Marketplace
          </span>
        </div>

        {/* Hero */}

        <h1 className="text-center text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
          Find your
          <br />
          Drive
        </h1>

        <p className="mt-8 text-center max-w-3xl text-neutral-400 text-lg md:text-xl">
          Buy, sell and discover premium vehicles with 
          verified listings, intelligent recommendations and trusted sellers.
        </p>

        {/* CTA Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/cars"
            className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition"
          >
            Browse Fleet
          </Link>

          <Link
            href="/sell"
            className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
          >
            Sell Your Car
          </Link>
        </div>

        {/* Stats */}

        <div className="flex flex-wrap justify-center gap-12 mt-16">
          <div className="text-center">
            <h3 className="text-4xl font-black">10K+</h3>
            <p className="text-neutral-500 text-sm">Cars Listed</p>
          </div>

          <div className="text-center">
            <h3 className="text-4xl font-black">5K+</h3>
            <p className="text-neutral-500 text-sm">Verified Sellers</p>
          </div>

          <div className="text-center">
            <h3 className="text-4xl font-black">99%</h3>
            <p className="text-neutral-500 text-sm">Trust Score</p>
          </div>
        </div>

        {/* Categories */}

        <div className="flex flex-wrap justify-center gap-4 mt-16">
          {categories.map((category) => (
            <button
              key={category}
              className="
                px-6
                py-3
                rounded-full
                bg-white/5
                border
                border-white/10
                backdrop-blur-lg
                hover:bg-white
                hover:text-black
                transition-all
                duration-300
                font-medium
              "
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Box */}

        <div className="w-full max-w-5xl mt-16">
          <div
            className="
            rounded-[32px]
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-6
            shadow-[0_0_50px_rgba(255,255,255,0.05)]
          "
          >
            <AnimatedSearch />
          </div>
        </div>

        {/* Brands */}

        <div className="mt-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-8">
            Trusted Brands
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-neutral-400 hover:text-white transition text-lg font-semibold"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}

        <div className="grid md:grid-cols-3 gap-8 mt-24 w-full">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
            <h3 className="text-xl font-bold mb-3">
              AI Vehicle Insights
            </h3>
            <p className="text-neutral-400">
              Smart pricing analysis and market comparisons for every listing.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
            <h3 className="text-xl font-bold mb-3">
              Verified Sellers
            </h3>
            <p className="text-neutral-400">
              Every seller is verified to ensure trust and transparency.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
            <h3 className="text-xl font-bold mb-3">
              Fast Transactions
            </h3>
            <p className="text-neutral-400">
              Connect with buyers and sellers instantly through our platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}