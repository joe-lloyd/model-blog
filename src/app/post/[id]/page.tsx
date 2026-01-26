import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import ImageGallery from "../../components/ImageGallery";
import Hero from "@/app/components/Hero";
import React from "react";
import VideoGallery from "@/app/components/VideoGallery";
import TitleWithUnderline from "@/app/components/TitleWithUnderline";
import PaintingRecipe from "@/app/components/PaintingRecipe";
import { MDXComponents } from "mdx/types";
import type { Metadata, ResolvingMetadata } from "next";
import paintsData from "@/data/paints.json";

interface Paint {
  name: string;
  brand: string;
  range?: string;
  color?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const contentDirectory = path.join(process.cwd(), "src/content");

function getPostData(id: string) {
  const filePath = path.join(contentDirectory, `${id}.mdx`);

  const fileContents = fs.readFileSync(filePath, "utf8");

  const { content, data: metadata } = matter(fileContents);

  return { content, metadata };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

  // Fetch post data (content and metadata)
  const { metadata } = getPostData(id);

  // Use coverImage if it exists, otherwise fall back to the first image
  const coverImageName =
    metadata.coverImage ||
    (metadata.imageNames && metadata.imageNames[0]?.name);

  const images = [];
  if (coverImageName) {
    const s3Bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
    // Use extraLarge for the highest quality social sharing card
    const imageUrl = `${s3Bucket}/images/${id}/${coverImageName}-extraLarge.webp`;
    images.push({
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: metadata.title,
    });
  }

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: images.length > 0 ? images : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: images.length > 0 ? [images[0].url] : undefined,
    },
  };
}

const overrideComponents: MDXComponents = {
  p: (props) => (
    <p
      className="text-gray-700 dark:text-gray-200 pt-5 pb-10 text-2xl"
      {...props}
    >
      {props.children}
    </p>
  ),
};

const paints = paintsData as Record<string, Paint>;

function resolvePaints(paintKeys?: string[]): Paint[] | undefined {
  if (!paintKeys || !Array.isArray(paintKeys)) return undefined;
  return paintKeys
    .map((key) => paints[key])
    .filter((paint): paint is Paint => !!paint);
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const { content, metadata } = getPostData(id);

  const airbrushPaints = resolvePaints(metadata.airbrushPaints);
  const brushPaints = resolvePaints(metadata.brushPaints);
  const speedPaints = resolvePaints(metadata.speedPaints);
  const washes = resolvePaints(metadata.washes);

  return (
    <div className="mb-8">
      <Hero title={metadata.title} description={metadata.description} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-500 dark:text-gray-200 sm:pt-5 md:pt-8 lg:pt-10 text-xl">
          {metadata.date}
        </p>
        {!!(metadata.videoNames && metadata.videoNames.length) && (
          <>
            <TitleWithUnderline title="Videos" />
            <VideoGallery videoNames={metadata.videoNames} slug={id} />
          </>
        )}
        <TitleWithUnderline title="Images" />
        <ImageGallery imageNames={metadata.imageNames} slug={id} />
        <MDXRemote source={content} components={overrideComponents} />
        {(airbrushPaints || brushPaints || speedPaints || washes) && (
          <PaintingRecipe
            airbrushPaints={airbrushPaints}
            brushPaints={brushPaints}
            speedPaints={speedPaints}
            washes={washes}
          />
        )}
      </div>
    </div>
  );
}
