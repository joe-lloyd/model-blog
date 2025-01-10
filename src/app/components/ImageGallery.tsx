"use client";

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import Image from 'next/image';
import React from 'react';

interface ImageGalleryProps {
  imageNames: Array<{ name: string; portrait?: boolean }>;
  slug: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageNames, slug }) => {
  return (
    <Gallery>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageNames.map(({ name, portrait = false }, index) => {
          const thumbnail = `/images/${slug}/${name}-thumbnail.webp`;
          const smallImage = `/images/${slug}/${name}-small.webp`;
          const mediumImage = `/images/${slug}/${name}-medium.webp`;
          const largeImage = `/images/${slug}/${name}-large.webp`;
          const extraLargeImage = `/images/${slug}/${name}-extraLarge.webp`;

          const originalSrcset = `
            ${extraLargeImage} 1920w,
            ${largeImage} 1200w,
            ${mediumImage} 800w,
            ${smallImage} 480w
          `.trim();

          // Adjust width and height for portrait images
          const width = portrait ? 1440 : 1920;
          const height = portrait ? 1920 : 1440;

          return (
            <Item
              key={index}
              original={extraLargeImage}
              originalSrcset={originalSrcset}
              thumbnail={thumbnail}
              width={width}
              height={height}
            >
              {({ ref, open }) => (
                <div
                  className="cursor-pointer relative overflow-hidden rounded-md group"
                  onClick={open}
                >
                  <Image
                    ref={ref as React.LegacyRef<HTMLImageElement>} // Cast ref for compatibility
                    src={thumbnail}
                    alt={`Image ${index + 1}`}
                    width={480}
                    height={480}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </Item>
          );
        })}
      </div>
    </Gallery>
  );
};

export default ImageGallery;
