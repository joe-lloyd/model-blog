"use client";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";
import React from "react";

interface ImageGalleryProps {
  imageNames: Array<{
    name: string;
    width?: number;
    height?: number;
  }>;
  slug: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageNames, slug }) => {
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

  // Distribute images into columns
  const columnWrapper: Array<typeof imageNames> = Array.from(
    { length: columns },
    () => [],
  );

  imageNames.forEach((img, index) => {
    columnWrapper[index % columns].push(img);
  });

  return (
    <Gallery>
      <div className="flex gap-4">
        {columnWrapper.map((colImages, colIndex) => (
          <div key={colIndex} className="flex flex-col flex-1 gap-4">
            {colImages.map(
              ({ name, width: imgWidth, height: imgHeight }, index) => {
                const thumbnail = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${slug}/${name}-thumbnail.webp`;
                const smallImage = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${slug}/${name}-small.webp`;
                const mediumImage = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${slug}/${name}-medium.webp`;
                const largeImage = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${slug}/${name}-large.webp`;
                const extraLargeImage = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${slug}/${name}-extraLarge.webp`;

                const originalSrcset = `
            ${extraLargeImage} 1920w,
            ${largeImage} 1200w,
            ${mediumImage} 800w,
            ${smallImage} 480w
          `.trim();

                const itemWidth = imgWidth || 1920;
                const itemHeight = imgHeight || 1440;

                // For the masonry grid, we use the small image just like the PostGrid
                return (
                  <Item
                    key={name}
                    original={extraLargeImage}
                    originalSrcset={originalSrcset}
                    thumbnail={smallImage}
                    width={itemWidth}
                    height={itemHeight}
                  >
                    {({ ref, open }) => (
                      <div
                        className="cursor-pointer relative overflow-hidden rounded-lg shadow-md group w-full"
                        onClick={open}
                      >
                        <Image
                          ref={ref as React.LegacyRef<HTMLImageElement>}
                          src={smallImage}
                          alt={`Image ${name}`}
                          width={itemWidth}
                          height={itemHeight} // Use actual dimensions
                          className="w-full h-auto block transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                  </Item>
                );
              },
            )}
          </div>
        ))}
      </div>
    </Gallery>
  );
};

export default ImageGallery;
