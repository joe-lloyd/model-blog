import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Hero from '@/app/components/Hero';
import PostsWrapper from '@/app/components/PostsWrapper';
import { Metadata } from 'next';

const contentDirectory = path.join(process.cwd(), 'src/content');

export const metadata: Metadata = {
  title: "Joe's Painted Models",
  description:
    "A place where I can post my painting projects, hopefully inspiring myself to paint more.",
  metadataBase: new URL("https://minis.joe-lloyd.com"),
  openGraph: {
    title: "Joe's Painted Models",
    description:
      "A place where I can post my painting projects, hopefully inspiring myself to paint more.",
    url: "https://minis.joe-lloyd.com",
    siteName: "Joe's Painted Models",
    images: [
      {
        url: "https://modelblogbucket.s3.eu-central-1.amazonaws.com/images/40k-darkelves-vehicles/6-extraLarge.webp",
        width: 1200,
        height: 630,
        alt: "Joe's Painted Models showcase banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe's Painted Models",
    description:
      "A place where I can post my painting projects, hopefully inspiring myself to paint more.",
    images: [
      "https://modelblogbucket.s3.eu-central-1.amazonaws.com/images/40k-darkelves-vehicles/6-extraLarge.webp",
    ],
  },
};

const getPostPreviews = () => {
  const fileNames = fs.readdirSync(contentDirectory);

  const posts = fileNames.map((fileName) => {
    const id = path.basename(fileName, '.mdx');
    const filePath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    const { data: metadata } = matter(fileContents);

    const imageNames = metadata.imageNames || [];
    const thumbnail = imageNames.length
      ? `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/images/${id}/${imageNames[0].name}-thumbnail.webp`
      : null;

    return {
      title: metadata.title,
      image: thumbnail,
      slug: id,
      tags: metadata.tags || [],
    };
  });

  const uniqueTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  );

  return { posts, uniqueTags };
};

export default function Home() {
  const { posts, uniqueTags } = getPostPreviews();

  return (
    <>
      <Hero title={"Welcome to My Model Gallery"} description={"Just a place to show my painted models"} />
      <PostsWrapper posts={posts} tags={uniqueTags} />
    </>
  );
}
