"use client";

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import Image from 'next/image';
import React from 'react';

interface ImageGalleryProps {
  imageNames: Array<string>;
  slug: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageNames, slug }) => {
  return (
    <Gallery>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageNames.map((name, index) => {
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

          return (
            <Item<HTMLImageElement>
              key={index}
              original={extraLargeImage}
              originalSrcset={originalSrcset}
              thumbnail={thumbnail}
              width={1920}
              height={1440}
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
