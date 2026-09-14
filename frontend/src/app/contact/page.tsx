'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const offices = [
    { city: 'Nairobi', address: 'Kimathi Street, Nairobi CBD', phone: '+254 794 603 876' },
    { city: 'Mombasa', address: 'Moi Avenue, Mombasa Island', phone: '+254 794 603 876' },
    { city: 'Kisumu', address: 'Oginga Odinga Road, Kisumu', phone: '+254 794 603 876' },
  ];

  const socials = [
    { 
      name: 'Twitter', 
      href: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube', 
      href: '#',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Get in Touch</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Let's <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-600">talk</span>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Have a question about a listing, need help selling your car, or just want to say hello? 
              We are here for you.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Contact Info */}
          <FadeIn delay={100} className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6">Contact Info</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Email</p>
                    <Link href="mailto:franklinekober@gmail.com" className="text-white hover:text-neutral-300 transition break-all">franklinekober@gmail.com</Link>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Phone</p>
                    <Link href="tel:+254794603876" className="text-white hover:text-neutral-300 transition">+254 794 603 876</Link>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Support Hours</p>
                    <p className="text-white">Mon – Fri, 9am – 8pm EAT</p>
                  </div>
                </div>
              </div>

              {/* Interactive 3D Keycap Social Dock with actual SVG icons */}
              <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6">Follow Us</h3>
                <div className="flex items-center gap-3 perspective-midrange">
                  {socials.map((social) => {
                    const isHovered = hoveredKey === social.name;
                    return (
                      <div
                        key={social.name}
                        onMouseEnter={() => setHoveredKey(social.name)}
                        onMouseLeave={() => setHoveredKey(null)}
                        className="relative cursor-pointer"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/20 flex items-center justify-center shadow-xl select-none text-white"
                          animate={{
                            y: isHovered ? -16 : 0,
                            rotateX: isHovered ? -25 : 0,
                            scale: isHovered ? 1.1 : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          {social.icon}
                        </motion.div>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2.5 py-1 rounded-md shadow-2xl pointer-events-none whitespace-nowrap z-20"
                          >
                            {social.name}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6">Press Inquiries</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  For media requests, brand partnerships, and press kits.
                </p>
                <Link href="mailto:franklinekober@gmail.com" className="text-white font-medium hover:underline break-all">
                  franklinekober@gmail.com
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={200} className="lg:col-span-3">
            <div className="rounded-4xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 sm:p-8 md:p-12">
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
                      className="w-full px-5 py-4 rounded-2xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/30 transition"
                    >
                      <option value="" className="bg-black text-neutral-400">Select a topic</option>
                      <option value="general" className="bg-black text-white">General Inquiry</option>
                      <option value="support" className="bg-black text-white">Customer Support</option>
                      <option value="sell" className="bg-black text-white">Selling a Car</option>
                      <option value="partners" className="bg-black text-white">Partnerships</option>
                      <option value="press" className="bg-black text-white">Press & Media</option>
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
                    className="w-full py-4 rounded-full bg-white text-black font-bold hover:scale-[1.02] transition cursor-pointer"
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
          <div className="mt-20 md:mt-24">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Locations</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">Our Offices</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {offices.map((office, i) => (
                <FadeIn key={office.city} delay={i * 100}>
                  <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-lg p-6 sm:p-8 hover:border-white/20 transition group">
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
          <div className="mt-20 md:mt-24 text-center pb-12">
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