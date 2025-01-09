"use client";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-fuchsia-500 via-pink-500 to-fuchsia-500 text-white flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Welcome to My Model Gallery
        </h1>
        <p className="mt-4 text-lg sm:text-2xl font-medium text-gray-200">
          Just a place for me to post my models
        </p>
      </div>
    </div>
  );
};

export default Hero;
