import React from "react";

interface Paint {
  name: string;
  brand: string;
  range?: string;
  color?: string;
}

interface PaintingRecipeProps {
  airbrushPaints?: Paint[];
  brushPaints?: Paint[];
}

// Hexagon component with text inside
const PaintHex = ({
  paint,
  index,
  totalInRow = 3,
}: {
  paint: Paint;
  index: number;
  totalInRow?: number;
}) => {
  const row = Math.floor(index / totalInRow);
  const isOddRow = row % 2 === 1;

  return (
    <div
      className={`relative ${isOddRow ? "ml-[60px]" : ""}`}
      style={{
        width: "120px",
        marginBottom: "-24px",
      }}
    >
      <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-lg">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        <polygon
          points="50,5 95,30 95,80 50,105 5,80 5,30"
          fill={paint.color || "#CCCCCC"}
          stroke="#ffffff"
          strokeWidth="3"
          filter="url(#shadow)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
        <div
          className="text-center font-bold text-sm leading-tight"
          style={{
            color:
              paint.color && isColorDark(paint.color) ? "#ffffff" : "#000000",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {paint.name}
        </div>
        <div
          className="text-[10px] mt-1 opacity-80"
          style={{
            color:
              paint.color && isColorDark(paint.color) ? "#ffffff" : "#000000",
          }}
        >
          {paint.brand}
        </div>
      </div>
    </div>
  );
};

// Helper to determine if color is dark
const isColorDark = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

export default function PaintingRecipe({
  airbrushPaints,
  brushPaints,
}: PaintingRecipeProps) {
  if (!airbrushPaints && !brushPaints) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        Paint Palette
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Airbrush section */}
        {airbrushPaints && airbrushPaints.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-blue-200 dark:border-gray-600 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12h3m6-6v3m0 6v3m6-6h3M6.5 6.5l2 2m7 7l2 2m0-11l-2 2m-7 7l-2 2" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Airbrush
              </h3>
            </div>
            <div className="flex flex-wrap">
              {airbrushPaints.map((paint, index) => (
                <PaintHex
                  key={index}
                  paint={paint}
                  index={index}
                  totalInRow={3}
                />
              ))}
            </div>
          </div>
        )}

        {/* Brush section */}
        {brushPaints && brushPaints.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-purple-200 dark:border-gray-600 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 2v6l-3 3.5V18a3 3 0 003 3 3 3 0 003-3v-6.5L9 8V2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Brush
              </h3>
            </div>
            <div className="flex flex-wrap">
              {brushPaints.map((paint, index) => (
                <PaintHex
                  key={index}
                  paint={paint}
                  index={index}
                  totalInRow={3}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
