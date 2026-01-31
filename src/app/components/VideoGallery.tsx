"use client";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import React from "react";

interface VideoGalleryProps {
  videoNames: Array<string>;
  slug: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videoNames, slug }) => {
  const [columns, setColumns] = React.useState(1);

  React.useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3);
      } else if (window.innerWidth >= 640) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute videos into columns
  const columnWrapper: Array<string[]> = Array.from(
    { length: columns },
    () => [],
  );

  videoNames.forEach((video, index) => {
    columnWrapper[index % columns].push(video);
  });

  return (
    <Gallery>
      <div className="flex gap-4">
        {columnWrapper.map((colVideos, colIndex) => (
          <div key={colIndex} className="flex flex-col flex-1 gap-4">
            {colVideos.map((name, index) => {
              const videoPath = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/videos/${slug}/${name}.webm`;
              const previewPath = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/videos/${slug}/${name}-preview.webm`;

              return (
                <Item
                  key={name}
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
                      className="cursor-pointer relative overflow-hidden rounded-lg shadow-md group w-full"
                      onClick={open}
                    >
                      {/* Preview video - using full video for quality */}
                      <video
                        ref={ref as React.LegacyRef<HTMLVideoElement>}
                        src={videoPath}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-auto block transform transition-transform duration-500 group-hover:scale-110"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                        onLoadedMetadata={(e) => {
                          // Optional: Set playback specific to preview
                        }}
                      />

                      {/* Overlay for play icon */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white drop-shadow-md"
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
        ))}
      </div>
    </Gallery>
  );
};

export default VideoGallery;
