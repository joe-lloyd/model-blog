import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Hero from '@/app/components/Hero';
import PostsWrapper from '@/app/components/PostsWrapper';


const contentDirectory = path.join(process.cwd(), 'src/content');

const getPostPreviews = () => {
  const fileNames = fs.readdirSync(contentDirectory);

  const posts = fileNames.map((fileName) => {
    const id = path.basename(fileName, '.mdx');
    const filePath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    const { data: metadata } = matter(fileContents);

    const imageNames = metadata.imageNames || [];
    const thumbnail = imageNames.length
      ? `/images/${id}/${imageNames[0].name}-thumbnail.webp`
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
