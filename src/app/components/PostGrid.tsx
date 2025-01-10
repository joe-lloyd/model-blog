import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  title: string;
  image: string | null;
  slug: string;
}

interface PostGridProps {
  posts: Post[];
}

const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posts.map((post, idx) => (
        <Link key={idx} href={`/post/${post.slug}`}>
          <div
            className="relative bg-white shadow-md rounded-md overflow-hidden border hover:shadow-lg transition group"
            style={{ maxWidth: "480px" }}
          >
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                width={480}
                height={480}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div
              className="absolute bottom-0 p-2 bg-gray-700 bg-opacity-60 w-full"
              style={{ maxWidth: "480px" }}
            >
              <h2 className="text-lg text-white font-semibold">{post.title}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostGrid;
