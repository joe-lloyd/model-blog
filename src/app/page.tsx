import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/app/components/Hero';


const contentDirectory = path.join(process.cwd(), 'src/content');

const getPostPreviews = () => {
  const fileNames = fs.readdirSync(contentDirectory);

  return fileNames.map((fileName) => {
    const id = path.basename(fileName, '.mdx'); // Extract the file name without extension
    const filePath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse metadata
    const { data: metadata } = matter(fileContents);

    // Generate thumbnail for the first image
    const imageNames = metadata.imageNames || [];
    const thumbnail = imageNames.length
      ? `/images/${id}/${imageNames[0]}-thumbnail.webp`
      : null;

    return {
      title: metadata.title,
      image: thumbnail, // Use the thumbnail version
      slug: id, // Use the file name as the slug
    };
  });
};

export default function Home() {
  const posts = getPostPreviews();

  return (
    <>
      <Hero title={"Welcome to My Model Gallery"} description={"Just a place to show my painted models"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {posts.map((post, idx) => (
            <Link key={idx} href={`/post/${post.slug}`}>
              <div
                className="relative bg-white shadow-md rounded-md overflow-hidden border hover:shadow-lg transition group"
                style={{maxWidth: "480px"}}
              >
                {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={480}
                      height={480}
                      className="object-cover"
                    />
                )}
                <div className="absolute bottom-0 p-2 bg-gray-700 bg-opacity-80 w-full" style={{maxWidth: "480px"}}>
                  <h2 className="text-lg text-white font-semibold">{post.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
