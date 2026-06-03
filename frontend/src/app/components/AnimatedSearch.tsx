'use client';

import { useState, useEffect } from 'react';

const placeholders = [
  "Search by make...", 
  "Search by model...", 
  "Search by lifestyle..."
];

export default function AnimatedSearch() {
  const [placeholder, setPlaceholder] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentString = placeholders[stringIndex];
    
    // Typing state
    if (!isDeleting && charIndex < currentString.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + currentString[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100); // Speed of typing
      return () => clearTimeout(timeout);
    } 
    // Deleting state
    else if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, 50); // Speed of deleting
      return () => clearTimeout(timeout);
    } 
    // Pause at full word
    else if (!isDeleting && charIndex === currentString.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000); // How long word stays visible
      return () => clearTimeout(timeout);
    } 
    // Move to next word
    else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setStringIndex((prev) => (prev + 1) % placeholders.length);
    }
  }, [charIndex, isDeleting, stringIndex]);

  return (
    <div className="w-full relative">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-white text-black px-6 py-4 rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-white/10 transition-all placeholder:text-neutral-500 text-lg shadow-inner"
      />
      <button className="absolute right-2 top-2 bottom-2 bg-black text-white px-8 rounded-full font-semibold hover:bg-neutral-800 transition shadow-md text-sm md:text-base">
        Search
      </button>
    </div>
  );
}