import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ImageGallery from '../../components/ImageGallery';

// Path to your content directory
const contentDirectory = path.join(process.cwd(), 'src/content');

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
    <div>
      <h1>{metadata.title}</h1>
      <p>should be gallery</p>
      <MDXRemote source={content} />
      <ImageGallery imageNames={metadata.imageNames} slug={id} />
    </div>
  );
}
