import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image'


const contentDirectory = path.join(process.cwd(), 'src/content');

const getPostPreviews = () => {
  const fileNames = fs.readdirSync(contentDirectory);

  return fileNames.map((fileName) => {
    const filePath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    // Extract the first image and replace with the thumbnail version
    const image = data.images ? data.images[0] : null;
    const thumbnail = image
      ? `/images/${data.slug}/${path.basename(image, path.extname(image))}-thumbnail.webp`
      : null;

    return {
      title: data.title,
      image: thumbnail, // Use thumbnail here
      slug: data.slug,
    };
  });
};

export default function Home() {
  const posts = getPostPreviews();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posts.map((post, idx) => (
        <Link key={idx} href={`/post/${post.slug}`}>
          <div className="relative bg-white shadow-md rounded-md overflow-hidden border hover:shadow-lg transition group">
            {post.image && (
              <div className="aspect-w-1 aspect-h-1">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={480}
                  height={480}
                  className="object-cover"
                />
              </div>
            )}
            <div className="absolute bottom-0 p-2 bg-gray-700 bg-opacity-80 w-full">
              <h2 className="text-lg text-white font-semibold">{post.title}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
