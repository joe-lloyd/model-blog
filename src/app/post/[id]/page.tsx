import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ImageGallery from '../../components/ImageGallery';
import Hero from '@/app/components/Hero';
import React from 'react';

const contentDirectory = path.join(process.cwd(), 'src/content');

const overrideComponents = {
  p: (props: any) => (
    <p {...props} className="text-gray-700 pt-10 pb-10">{props.children}</p>
  ),
}

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
    <>
      <Hero title={metadata.title} description={metadata.description} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <MDXRemote source={content} components={overrideComponents} />
        <ImageGallery imageNames={metadata.imageNames} slug={id} />
      </div>
    </>
  );
}
