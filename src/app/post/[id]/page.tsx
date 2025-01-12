import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ImageGallery from '../../components/ImageGallery';
import Hero from '@/app/components/Hero';
import React from 'react';
import VideoGallery from '@/app/components/VideoGallery';
import TitleWithUnderline from '@/app/components/TitleWithUnderline';
import { MDXComponents } from 'mdx/types';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
};

const contentDirectory = path.join(process.cwd(), 'src/content');
function getPostData(id: string) {
  const filePath = path.join(contentDirectory, `${id}.mdx`);

  const fileContents = fs.readFileSync(filePath, 'utf8');

  const { content, data: metadata } = matter(fileContents);

  return { content, metadata };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  // Fetch post data (content and metadata)
  const { metadata } = getPostData(id);

  // Construct the image URL dynamically
  const image = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${id}/${metadata.imageNames[0]}-small.webp`;

  // Construct the post URL
  const url = `https://minis.joe-lloyd.com/post/${id}`;

  // Optionally access parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `Image for ${metadata.title}`,
        },
        ...previousImages, // Retain any parent metadata images if necessary
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [image],
    },
  };
}

const overrideComponents: MDXComponents = {
  p: (props) => (
    <p {...props} className="text-gray-700 pt-5 pb-10 text-2xl">{props.children}</p>
  ),
};


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { content, metadata } = getPostData(id);

  return (
    <div className="mb-8">
      <Hero title={metadata.title} description={metadata.description} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-500 sm:pt-5 md:pt-8 lg:pt-10 text-xl">{metadata.date}</p>
        <MDXRemote source={content} components={overrideComponents} />
        {!!(metadata.videoNames && metadata.videoNames.length) && (
          <>
            <TitleWithUnderline title="Videos" />
            <VideoGallery videoNames={metadata.videoNames} slug={id} />
          </>
        )}
        <TitleWithUnderline title="Images" />
        <ImageGallery imageNames={metadata.imageNames} slug={id} />
      </div>
    </div>
  );
}
