'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

export default function CareersPage() {
  const benefits = [
    { icon: '🚗', title: 'Car Allowance', desc: 'Monthly vehicle stipend so you can drive what you sell.' },
    { icon: '🏥', title: 'Health First', desc: 'Premium medical, dental, and vision coverage for you and family.' },
    { icon: '🌴', title: 'Unlimited PTO', desc: 'Take the time you need. We trust you to manage your schedule.' },
    { icon: '📈', title: 'Equity', desc: 'Every employee gets a meaningful stake in Cikars success.' },
    { icon: '🏠', title: 'Hybrid Work', desc: 'Work from home or our flagship showroom offices worldwide.' },
    { icon: '🎓', title: 'Learning Budget', desc: '$3,000 annual budget for courses, conferences, and books.' },
  ];

  const openings = [
    { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Designer', dept: 'Design', location: 'New York / Remote', type: 'Full-time' },
    { title: 'Vehicle Operations Manager', dept: 'Operations', location: 'Los Angeles', type: 'Full-time' },
    { title: 'Growth Marketing Lead', dept: 'Marketing', location: 'Remote', type: 'Full-time' },
    { title: 'Customer Success Specialist', dept: 'Support', location: 'London / Remote', type: 'Full-time' },
    { title: 'Data Scientist', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />

      <div className="h-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Join Us</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Build the future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">of mobility</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We are a team of builders, designers, and car obsessives on a mission to transform 
              the automotive marketplace. If that excites you, we should talk.
            </p>
            <Link href="#openings" className="inline-block mt-8 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition">
              View Open Positions
            </Link>
          </div>
        </FadeIn>

        {/* Culture */}
        <FadeIn delay={100}>
          <div className="rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-12 md:p-16 mb-24 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6">Our Culture</h2>
            <p className="text-neutral-400 text-lg max-w-3xl mx-auto leading-relaxed">
              We move fast, think big, and obsess over the details. At Cikars, you will work alongside 
              world-class talent who genuinely care about the product and the people using it. 
              No politics, no bureaucracy — just impact.
            </p>
          </div>
        </FadeIn>

        {/* Benefits */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Perks</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Why Work Here</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {benefits.map((b, i) => (
            <FadeIn key={b.title} delay={i * 100}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8 hover:bg-white/[0.06] transition group">
                <div className="text-4xl mb-4 opacity-60 group-hover:opacity-100 transition">{b.icon}</div>
                <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Openings */}
        <FadeIn>
          <div id="openings" className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Open Roles</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Join the Team</h2>
          </div>
        </FadeIn>
        <div className="space-y-4">
          {openings.map((job, i) => (
            <FadeIn key={job.title} delay={i * 80}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-6 md:p-8 hover:border-white/20 transition group">
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-neutral-300 transition">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                    <span>{job.dept}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-full border border-white/20 text-sm font-medium hover:bg-white hover:text-black transition whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200}>
          <div className="text-center mt-16">
            <p className="text-neutral-500 mb-4">Don't see your role?</p>
            <Link href="/contact" className="text-white font-medium hover:underline">
              Send us a general application →
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}