'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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

export default function BlogPage() {
  const categories = ['All', 'Buying Guide', 'Market Trends', 'Electric', 'Luxury', 'Maintenance', 'Industry'];

  const featured = {
    title: 'The 2026 Electric Vehicle Landscape: What Buyers Need to Know',
    excerpt: 'With over 50 new EV models hitting the market this year, the landscape has never been more competitive. We break down the standouts, the disappointments, and the deals you cannot miss.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop',
    date: 'July 18, 2026',
    readTime: '8 min read',
    category: 'Electric',
  };

  const posts = [
    {
      title: 'How to Negotiate Like a Pro at the Dealership',
      excerpt: 'Insider tactics from former sales managers that can save you thousands on your next purchase.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
      date: 'July 15, 2026',
      readTime: '5 min read',
      category: 'Buying Guide',
    },
    {
      title: 'Porsche vs. Mercedes: The Luxury Sedan Showdown',
      excerpt: 'We put the Panamera and the S-Class head-to-head in the ultimate comparison test.',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
      date: 'July 10, 2026',
      readTime: '6 min read',
      category: 'Luxury',
    },
    {
      title: 'Why Used Car Prices Are Finally Dropping',
      excerpt: 'An analysis of market data showing the first sustained price decline in three years.',
      image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=800&auto=format&fit=crop',
      date: 'July 5, 2026',
      readTime: '4 min read',
      category: 'Market Trends',
    },
    {
      title: 'The Complete Guide to Winter Car Care',
      excerpt: 'Protect your investment with these essential cold-weather maintenance tips.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop',
      date: 'June 28, 2026',
      readTime: '7 min read',
      category: 'Maintenance',
    },
    {
      title: 'Tesla Model 3 Refresh: First Drive Impressions',
      excerpt: 'We spent a week with the updated Model 3. Here is what changed and what did not.',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop',
      date: 'June 22, 2026',
      readTime: '5 min read',
      category: 'Electric',
    },
    {
      title: 'The Rise of Subscription Car Ownership',
      excerpt: 'Is the traditional ownership model dying? We explore the booming subscription market.',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
      date: 'June 15, 2026',
      readTime: '6 min read',
      category: 'Industry',
    },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />

      <div className="h-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Insights</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">The Garage</h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Stories, guides, and market intelligence for the modern car enthusiast.
            </p>
          </div>
        </FadeIn>

        {/* Category Filter */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition ${cat === 'All' ? 'bg-white text-black border-white' : 'border-white/10 bg-white/5 hover:bg-white hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Featured Post */}
        <FadeIn delay={150}>
          <div className="mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4">Featured</p>
            <Link href="#" className="group block rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-lg overflow-hidden hover:border-white/20 transition">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto min-h-[320px]">
                  <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 group-hover:text-neutral-300 transition">
                    {featured.title}
                  </h2>
                  <p className="text-neutral-400 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </FadeIn>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <FadeIn key={post.title} delay={i * 100}>
              <Link href="#" className="group block rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-lg overflow-hidden hover:border-white/20 transition h-full">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-neutral-300 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Newsletter */}
        <FadeIn delay={200}>
          <div className="mt-24 rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Never Miss a Story</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Get our best articles delivered to your inbox every week. No spam, just cars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition"
              />
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}