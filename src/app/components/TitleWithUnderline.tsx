import React from 'react';

interface TitleWithUnderlineProps {
  title: string;
}

const TitleWithUnderline: React.FC<TitleWithUnderlineProps> = ({ title }) => {
  return (
    <div className="my-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-300">{title}</h2>
      <hr className="mt-2 w-full mx-auto border-t-4 border-red-700" />
    </div>
  );
};

export default TitleWithUnderline;
