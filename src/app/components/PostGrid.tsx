import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  title: string;
  image: string | null;
  slug: string;
  width?: number;
  height?: number;
}

interface PostGridProps {
  posts: Post[];
}

const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3);
      } else if (window.innerWidth >= 640) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute posts into columns
  const columnWrapper: Post[][] = Array.from({ length: columns }, () => []);

  posts.forEach((post, index) => {
    columnWrapper[index % columns].push(post);
  });

  return (
    <div className="flex gap-4 p-4">
      {columnWrapper.map((colPosts, colIndex) => (
        <div key={colIndex} className="flex flex-col flex-1 gap-4">
          {colPosts.map((post) => (
            <Link key={post.slug} href={`/post/${post.slug}`}>
              <div className="relative group w-full overflow-hidden rounded-lg shadow-md">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={post.width || 600}
                    height={post.height || 400}
                    className="w-full h-auto block transform transition-transform duration-500 group-hover:scale-110"
                    priority={
                      posts.indexOf(post) < 4
                    } /* Good practice for above-fold LCP */
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
                  <h2 className="text-white font-bold text-lg drop-shadow-md group-hover:text-amber-200 transition-colors duration-300">
                    {post.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
