import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ImageGallery from '../../components/ImageGallery';
import Hero from '@/app/components/Hero';
import React from 'react';

// Path to your content directory
const contentDirectory = path.join(process.cwd(), 'src/content');

const overrideComponents = {
  p: (props: any) => (
    <p {...props} className="text-gray-700 pt-4 pb-4">{props.children}</p>
  ),
}

// Fetch the raw content and metadata from the `.mdx` file
function getPostData(id: string) {
  const filePath = path.join(contentDirectory, `${id}.mdx`);

  // Read file content
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // Parse metadata and content
  const { content, data: metadata } = matter(fileContents);

  return { content, metadata };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Get content and metadata
  const { content, metadata } = getPostData(id);

  return (
    <>
      <Hero title={metadata.title} description={metadata.description} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <MDXRemote source={content} components={overrideComponents} />
        <ImageGallery imageNames={metadata.imageNames} slug={id} />
      </div>
    </>
  );
}
