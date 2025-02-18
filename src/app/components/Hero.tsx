'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import SparkEffect from '@/app/components/specialEffects/SparkEffect';

interface HeroProps {
  title: string;
  description: string;
}

const Hero: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <div
      className="relative mb-10 text-white"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40">
        <Image src={"/images/background-large.webp"} alt="Background" layout="fill" objectFit="cover" />
        <SparkEffect />
      </div>

      {/* Home Link */}
      <div className="relative text-end p-4 w-full">
        <Link
          href="/"
          className="relative inline-block px-6 py-3 font-semibold text-white bg-gradient-to-r from-red-700 via-black to-red-700 rounded-md shadow-lg hover:from-red-800 hover:via-black hover:to-red-800 transition-transform transform hover:scale-105"
        >
          <span
            className="absolute inset-0 w-full h-full border-2 border-red-600 rounded-md animate-pulse"
          ></span>
          <span className="relative z-10">Home</span>
        </Link>
      </div>


      {/* Content */}
      <div
        className="relative z-10 flex flex-col-reverse md:flex-row items-end justify-between max-w-7xl mx-auto"
      >
        {/* Orc Warboss Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/output-extraLarge.webp"
            width={800}
            height={800}
            alt="Orc Warboss"
            className="w-full max-w-sm md:max-w-md object-contain drop-shadow-2xl"
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center p-8 mt-8 md:mt-0 relative">
          <div
            className="p-6 rounded-lg shadow-lg"
            style={{
              background: 'linear-gradient(to right, rgba(139, 0, 0, 0.7), rgba(0, 0, 0, 0.7), rgba(139, 0, 0, 0.7))',
            }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-4 text-lg sm:text-2xl font-medium text-gray-300">
              {description}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
