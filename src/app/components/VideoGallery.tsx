"use client";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import React from "react";

interface VideoData {
  name: string;
  poster?: string;
  width?: number;
  height?: number;
}

interface VideoGalleryProps {
  videoNames: Array<string | VideoData>;
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

  const columnWrapper: Array<Array<string | VideoData>> = Array.from(
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
            {colVideos.map((video, index) => {
              const name = typeof video === "string" ? video : video.name;
              const videoPath = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/videos/${slug}/${name}.webm`;
              const previewPath = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/videos/${slug}/${name}-preview.webm`;

              const originalWidth =
                typeof video !== "string" && video.width ? video.width : 1920;
              const originalHeight =
                typeof video !== "string" && video.height ? video.height : 1080;

              return (
                <Item
                  key={name}
                  original={videoPath}
                  width={originalWidth}
                  height={originalHeight}
                  content={
                    <div className="flex justify-center items-center h-full w-full">
                      <video
                        controls
                        src={videoPath}
                        className="max-h-screen max-w-full object-contain"
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
