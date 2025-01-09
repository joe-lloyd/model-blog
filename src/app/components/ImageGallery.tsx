"use client";

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import React from 'react';

interface ImageGalleryProps {
  images: Array<string>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <Gallery>
      {images.map((image, index) => (
        <Item
          key={index}
          original={image}
        >
          {({ ref, open }) => (
            <img
              ref={ref}
              onClick={open}
              src={image}
              width={300}
              height={300}
              alt={`Image ${index + 1}`}
              className="cursor-pointer"
            />
          )}
        </Item>
      ))}
    </Gallery>
  );
};

export default ImageGallery;
