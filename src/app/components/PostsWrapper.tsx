"use client";

import React, { useState } from "react";
import SearchBar from "./SearchBar";
import PostGrid from "./PostGrid";

interface Post {
  title: string;
  image: string | null;
  slug: string;
  tags: string[];
  width?: number;
  height?: number;
}

interface PostsWrapperProps {
  posts: Post[];
  tags: string[];
}

const PostsWrapper: React.FC<PostsWrapperProps> = ({ posts, tags }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase().includes(value)),
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-0 lg:px-8">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        suggestions={tags}
      />
      <PostGrid posts={filteredPosts} />
    </div>
  );
};

export default PostsWrapper;
