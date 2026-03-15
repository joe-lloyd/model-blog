import React from "react";

interface RecipeBlockProps {
  children: React.ReactNode;
}

export default function RecipeBlock({ children }: RecipeBlockProps) {
  return (
    <blockquote
      className="my-10 p-6 sm:p-8 bg-slate-50 dark:bg-gray-900/40 border-l-[6px] border-blue-600 rounded-r-2xl shadow-lg relative w-full
      [&_ul]:list-none [&_ul]:pl-0 [&_ul_li]:relative [&_ul_li]:pl-6 [&_ul_li]:mb-4 [&_ul_li]:text-lg [&_ul_li]:text-gray-800 [&_ul_li]:dark:text-gray-200
      [&_ul_li::before]:content-[''] [&_ul_li::before]:absolute [&_ul_li::before]:left-0 [&_ul_li::before]:top-[10px] [&_ul_li::before]:w-2.5 [&_ul_li::before]:h-2.5 [&_ul_li::before]:bg-blue-600 [&_ul_li::before]:rounded-full [&_ul_li::before]:shadow-[0_0_8px_rgba(37,99,235,0.6)]
      [&_ol]:list-decimal [&_ol]:pl-8 [&_ol_li]:mb-4 [&_ol_li]:text-xl [&_ol_li]:text-gray-800 [&_ol_li]:dark:text-gray-200 [&_ol_li::marker]:text-blue-600 [&_ol_li::marker]:font-black [&_ol_li::marker]:text-2xl
      [&_p]:text-2xl [&_p]:font-bold [&_p]:mb-6 [&_p]:text-gray-900 [&_p]:dark:text-gray-100 [&_p]:uppercase [&_p]:tracking-wide"
    >
      {/* Decorative quote icon */}
      <span className="absolute top-4 right-6 text-6xl text-gray-200 dark:text-gray-800/50 leading-none select-none font-serif opacity-50">
        &rdquo;
      </span>
      <div className="relative z-10 w-full">{children}</div>
    </blockquote>
  );
}
