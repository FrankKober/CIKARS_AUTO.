'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeIn();
  return (
    <div ref={ref} className={`transition-all duration-700 ${className}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const values = [
    { title: 'Transparency', desc: 'No hidden fees, no surprise charges. Every listing shows exactly what you get.' },
    { title: 'Trust', desc: 'Every seller is verified. Every vehicle history is available. Every transaction is protected.' },
    { title: 'Innovation', desc: 'AI-powered pricing, smart recommendations, and seamless digital experiences.' },
    { title: 'Community', desc: 'Built by car lovers, for car lovers. We celebrate the culture of driving.' },
  ];

  const team = [
    { name: 'Frankline Kober', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
    { name: 'Pruddy Kirui', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
    { name: 'Emmanuel Kemboi', role: 'CTO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Irene', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' },
    { name: 'Anthony Muhoro', role: 'Lead Engineer', image: 'https://res.cloudinary.com/dyzssa40e/image/upload/v1745325459/WhatsApp_Image_2025-04-22_at_3.36.05_PM_ath8zi.jpg' },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % team.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-159 h-150 bg-white/5 rounded-full blur-[150px]" />

      {/* Navbar spacer */}
      <div className="h-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Our Story</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Built for the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-600">love of cars</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Cikars was born from a simple frustration: buying and selling premium vehicles online was broken. 
              So we rebuilt it from the ground up — with trust, technology, and transparency at the core.
            </p>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { value: '2021', label: 'Founded' },
              { value: '50K+', label: 'Happy Drivers' },
              { value: '$2B+', label: 'Vehicles Sold' },
              { value: '12', label: 'Countries' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-lg p-8 text-center">
                <h3 className="text-4xl font-black tracking-tighter mb-2">{stat.value}</h3>
                <p className="text-neutral-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <FadeIn>
            <div className="relative h-100 rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
                alt="Car showroom"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Our Mission</p>
              <h2 className="text-4xl font-black tracking-tighter mb-6">Redefining how the world buys and sells cars</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                We believe finding your next vehicle should be as exciting as driving it. No pushy salespeople, 
                no sketchy listings, no guesswork. Just a curated marketplace where every car tells a story 
                and every seller is held to the highest standard.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                From AI-powered price insights to escrow-protected transactions, we have built the infrastructure 
                that the car market deserved all along.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Values */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">What We Stand For</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Our Values</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 100}>
              <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-lg p-8 h-full hover:border-white/20 transition">
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Meet the Team - 3D Coverflow / Card Deck Carousel */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">The People</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Meet the Team</h2>
          </div>
        </FadeIn>

        <div className="relative w-full max-w-5xl mx-h-[600px] h-125 flex flex-col items-center justify-center overflow-hidden mb-20">
          <div className="relative w-full h-95 flex items-center justify-center perspective-[1000px]">
            {team.map((member, i) => {
              // Calculate offset relative to activeIndex for coverflow effect
              let offset = (i - activeIndex + team.length) % team.length;
              if (offset > team.length / 2) offset -= team.length;

              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              return (
                <motion.div
                  key={member.name}
                  onClick={() => setActiveIndex(i)}
                  className={`absolute cursor-pointer rounded-3xl overflow-hidden border border-white/20 bg-neutral-900 shadow-3xl transition-all duration-100`}
                  style={{
                    width: '280px',
                    height: '380px',
                  }}
                  animate={{
                    x: offset * 140,
                    scale: isActive ? 1.1 : 1 - absOffset * 0.15,
                    zIndex: team.length - absOffset,
                    opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.35,
                    rotateY: offset * -15,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                      <h3 className="font-bold text-xl text-white">{member.name}</h3>
                      <p className="text-neutral-400 text-sm">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer"
            >
              &larr;
            </button>
            <div className="flex items-center gap-2">
              {team.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? 'w-8 bg-white' : 'w-2 bg-neutral-700'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}