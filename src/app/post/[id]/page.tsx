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

const contentDirectory = path.join(process.cwd(), 'src/content');

const overrideComponents: MDXComponents = {
  p: (props) => (
    <p {...props} className="text-gray-700 pt-5 pb-10 text-2xl">{props.children}</p>
  ),
};

function getPostData(id: string) {
  const filePath = path.join(contentDirectory, `${id}.mdx`);

  const fileContents = fs.readFileSync(filePath, 'utf8');

  const { content, data: metadata } = matter(fileContents);

  return { content, metadata };
}

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
