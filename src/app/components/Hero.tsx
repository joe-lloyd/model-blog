'use client';

import Link from 'next/link';
import React from 'react';

interface HeroProps {
  title: string;
  description: string;
}

const Hero: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <div
      className="relative bg-gradient-to-r from-fuchsia-500 via-pink-500 to-fuchsia-500 text-white flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Home Link */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href="/"
          className="bg-white text-fuchsia-500 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
        >
          Home
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-lg sm:text-2xl font-medium text-gray-200">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Hero;
