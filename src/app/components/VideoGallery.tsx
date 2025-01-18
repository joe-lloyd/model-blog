"use client";

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import React from 'react';

interface VideoGalleryProps {
  videoNames: Array<string>;
  slug: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videoNames, slug }) => {
  return (
    <Gallery>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoNames.map((name, index) => {
          const videoPath = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/videos/${slug}/${name}.webm`;
          const previewPath = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/videos/${slug}/${name}-preview.webm`;

          return (
            <Item
              key={index}
              original={videoPath}
              content={
              <div className="flex justify-center items-center h-full">
                <video
                  controls
                  src={videoPath}
                  className="w-full aspect-video max-w-screen-md"
                />
              </div>
              }
              thumbnail={previewPath}
            >
              {({ ref, open }) => (
                <div
                  className="cursor-pointer relative overflow-hidden rounded-md group"
                  onClick={open}
                >
                  {/* Preview video */}
                  <video
                    ref={ref as React.LegacyRef<HTMLVideoElement>} // Cast ref for compatibility
                    src={previewPath}
                    muted
                    playsInline
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />

                  {/* Overlay for play icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-5.197-3.034A1 1 0 008 9v6a1 1 0 001.555.832l5.197-3.034a1 1 0 000-1.664z"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </Item>
          );
        })}
      </div>
    </Gallery>
  );
};

export default VideoGallery;
