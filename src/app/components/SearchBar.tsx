"use client";

import React, { useState } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  suggestions,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e);

    const value = e.target.value.toLowerCase();
    if (value) {
      const filtered = suggestions.filter((tag) =>
        tag.toLowerCase().includes(value)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleTagClick = (tag: string) => {
    onSearchChange({ target: { value: tag } } as any);
    setFilteredSuggestions([]);
  };

  return (
    <div className="relative w-full my-6 p-4">
      <input
        type="text"
        placeholder="Search by tag..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full p-3 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
      />

      {/* Dropdown Suggestions */}
      {filteredSuggestions.length > 0 && (
        <ul className="absolute left-4 right-4 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
          {filteredSuggestions.map((tag, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-fuchsia-500 hover:text-white"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
