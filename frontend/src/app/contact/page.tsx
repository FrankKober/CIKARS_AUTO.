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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const offices = [
    { city: 'New York', address: '350 Fifth Avenue, Suite 4200', phone: '+1 (212) 555-0147' },
    { city: 'London', address: '1 Canada Square, Canary Wharf', phone: '+44 20 7946 0958' },
    { city: 'Dubai', address: 'Burj Khalifa Blvd, Downtown Dubai', phone: '+971 4 123 4567' },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />

      <div className="h-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Get in Touch</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">talk</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Have a question about a listing, need help selling your car, or just want to say hello? 
              We are here for you.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <FadeIn delay={100} className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8">
                <h3 className="text-xl font-bold mb-6">Contact Info</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Email</p>
                    <Link href="mailto:hello@cikars.com" className="text-white hover:text-neutral-300 transition">hello@cikars.com</Link>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Phone</p>
                    <Link href="tel:+18001234567" className="text-white hover:text-neutral-300 transition">+1 (800) 123-4567</Link>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Support Hours</p>
                    <p className="text-white">Mon – Fri, 9am – 8pm EST</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8">
                <h3 className="text-xl font-bold mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                    <button
                      key={social}
                      className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium hover:bg-white hover:text-black transition"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8">
                <h3 className="text-xl font-bold mb-6">Press Inquiries</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  For media requests, brand partnerships, and press kits.
                </p>
                <Link href="mailto:press@cikars.com" className="text-white font-medium hover:underline">
                  press@cikars.com
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={200} className="lg:col-span-3">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-12">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-black tracking-tighter mb-2">Message Sent</h3>
                  <p className="text-neutral-400">We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition appearance-none"
                    >
                      <option value="" className="bg-black">Select a topic</option>
                      <option value="general" className="bg-black">General Inquiry</option>
                      <option value="support" className="bg-black">Customer Support</option>
                      <option value="sell" className="bg-black">Selling a Car</option>
                      <option value="partners" className="bg-black">Partnerships</option>
                      <option value="press" className="bg-black">Press & Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-white text-black font-bold hover:scale-[1.02] transition"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Offices */}
        <FadeIn delay={300}>
          <div className="mt-24">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Locations</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Our Offices</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {offices.map((office, i) => (
                <FadeIn key={office.city} delay={i * 100}>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg p-8 hover:border-white/20 transition group">
                    <h3 className="text-2xl font-black tracking-tighter mb-4">{office.city}</h3>
                    <div className="space-y-2 text-neutral-400 text-sm">
                      <p>{office.address}</p>
                      <p>{office.phone}</p>
                    </div>
                    <div className="mt-6 h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-600 text-sm">
                      Map Placeholder
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* FAQ Teaser */}
        <FadeIn delay={200}>
          <div className="mt-24 text-center">
            <p className="text-neutral-500 mb-4">Prefer self-service?</p>
            <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 font-medium hover:bg-white hover:text-black transition">
              Visit our Help Center <span>→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}