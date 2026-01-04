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
  speedPaints?: Paint[];
}

// Helper to lighten/darken colors for shading
const adjustColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

// Helper to get hand-crafted row distribution patterns
const getRowDistribution = (count: number): number[] => {
  switch (count) {
    case 1:
      return [1];
    case 2:
      return [2];
    case 3:
      return [2, 1];
    case 4:
      return [2, 2];
    case 5:
      return [3, 2];
    case 6:
      return [3, 3];
    case 7:
      return [2, 3, 2];
    case 8:
      return [3, 2, 3];
    case 9:
      return [3, 3, 3];
    case 10:
      return [3, 4, 3];
    case 11:
      return [4, 3, 4];
    case 12:
      return [4, 4, 4];
    default:
      // Fallback: groups of 3 or 4
      const rows: number[] = [];
      let remaining = count;
      while (remaining > 0) {
        if (remaining >= 4) {
          rows.push(4);
          remaining -= 4;
        } else {
          rows.push(remaining);
          remaining = 0;
        }
      }
      return rows;
  }
};

// Helper to determine if color is dark
const isColorDark = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");
  if (hex.length < 6) return false;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 150;
};

// 3D Isometric Cube component
const PaintCube = ({
  paint,
  row,
  col,
  gridOffset,
  rowsCount,
  paintsCount,
}: {
  paint: Paint;
  row: number;
  col: number;
  gridOffset: number;
  rowsCount: number;
  paintsCount: number;
}) => {
  const baseColor = paint.color || "#CCCCCC";
  const topColor = adjustColor(baseColor, 15);
  const leftColor = adjustColor(baseColor, -10);
  const rightColor = baseColor;

  const width = 100;
  const height = 115;
  const horizontalSpacing = width;
  const verticalSpacing = height * 0.75;

  // Staggering logic:
  // For 3-row patterns where the middle row is wider (7, 10), middle row is anchor (stagger 0)
  // Otherwise (8, 9, 11, 12, etc.), top/bottom are anchor
  const useMiddleAnchor = paintsCount === 7 || paintsCount === 10;
  const staggerBasis = useMiddleAnchor ? 1 : 0;
  const stagger = (row + staggerBasis) % 2 === 1 ? 0.5 : 0;

  const x = (col + stagger + gridOffset) * horizontalSpacing;
  const y = row * verticalSpacing;

  return (
    <div
      className="absolute transition-transform hover:scale-110 duration-200 z-10"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-md">
        {/* Top face */}
        <polygon points="50,5 95,30 50,55 5,30" fill={topColor} />
        {/* Left face */}
        <polygon points="5,30 50,55 50,105 5,80" fill={leftColor} />
        {/* Right face */}
        <polygon points="95,30 50,55 50,105 95,80" fill={rightColor} />
        {/* Borders */}
        <polyline
          points="50,5 95,30 95,80 50,105 5,80 5,30 50,5"
          fill="none"
          stroke="#222"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        <line
          x1="50"
          y1="55"
          x2="5"
          y2="30"
          stroke="#222"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        <line
          x1="50"
          y1="55"
          x2="95"
          y2="30"
          stroke="#222"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="105"
          stroke="#222"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-1 pt-3 pointer-events-none">
        <div
          className="text-center font-black text-[10px] leading-[1.1] uppercase tracking-tight"
          style={{
            color: isColorDark(baseColor) ? "#ffffff" : "#000000",
            textShadow: isColorDark(baseColor)
              ? "0 1px 2px rgba(0,0,0,0.8)"
              : "0 1px 1px rgba(255,255,255,0.8)",
          }}
        >
          {paint.name}
        </div>
        <div
          className="text-[7px] mt-0.5 opacity-75 font-bold"
          style={{
            color: isColorDark(baseColor) ? "#ffffff" : "#000000",
          }}
        >
          {paint.brand}
        </div>
      </div>
    </div>
  );
};

// Updated HoneycombGrid to use dynamic row distribution
const HoneycombGrid = ({ paints }: { paints: Paint[] }) => {
  if (!paints || paints.length === 0) return null;

  const paintsCount = paints.length;
  const distribution = getRowDistribution(paintsCount);
  const rows: Paint[][] = [];
  let currentIndex = 0;

  distribution.forEach((count) => {
    rows.push(paints.slice(currentIndex, currentIndex + count));
    currentIndex += count;
  });

  const width = 100;
  const height = 115;
  const rowsCount = rows.length;

  // Staggering logic needs to match PaintCube
  const useMiddleAnchor = paintsCount === 7 || paintsCount === 10;
  const staggerBasis = useMiddleAnchor ? 1 : 0;

  let minUX = 1000;
  let maxUX = -1000;

  rows.forEach((rowPaints, rowIndex) => {
    const stagger = (rowIndex + staggerBasis) % 2 === 1 ? 0.5 : 0;
    const rowMin = stagger;
    const rowMax = stagger + rowPaints.length;
    if (rowMin < minUX) minUX = rowMin;
    if (rowMax > maxUX) maxUX = rowMax;
  });

  const totalWidthUnits = maxUX - minUX;
  const maxItemsInRow = Math.max(...distribution);

  const gridOffset = (maxItemsInRow - totalWidthUnits) / 2 - minUX;

  const totalWidth = maxItemsInRow * width;
  const totalHeight = rowsCount * height * 0.75 + height * 0.25;

  // Responsive scale: if we have 4+ items, scale down slightly to fit cards
  const scale = maxItemsInRow > 3 ? 0.8 : 1.0;

  return (
    <div className="flex justify-center w-full">
      <div
        className="relative overflow-visible select-none origin-center"
        style={{
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
          transform: `scale(${scale})`,
          margin:
            maxItemsInRow > 3
              ? `-${(totalHeight * (1 - scale)) / 2}px -${
                  (totalWidth * (1 - scale)) / 2
                }px`
              : "0",
        }}
      >
        {rows.map((rowPaints, rowIndex) =>
          rowPaints.map((paint, colIndex) => (
            <PaintCube
              key={`${rowIndex}-${colIndex}`}
              paint={paint}
              row={rowIndex}
              col={colIndex}
              gridOffset={gridOffset}
              rowsCount={rowsCount}
              paintsCount={paintsCount}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function PaintingRecipe({
  airbrushPaints,
  brushPaints,
  speedPaints,
}: PaintingRecipeProps) {
  if (!airbrushPaints && !brushPaints && !speedPaints) {
    return null;
  }

  return (
    <div className="my-16 flex flex-col items-center">
      <div className="w-full">
        <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-12 flex items-center gap-4 justify-center sm:justify-start">
          <div className="bg-blue-600 w-3 h-10 rounded-full shadow-lg shadow-blue-500/50"></div>
          PAINT RANGE
        </h2>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Airbrush section */}
          {airbrushPaints && airbrushPaints.length > 0 && (
            <div className="bg-slate-50 dark:bg-gray-900/40 rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-visible">
              <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl shadow-inner">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M3 12h3m6-6v3m0 6v3m6-6h3M6.5 6.5l2 2m7 7l2 2m0-11l-2 2m-7 7l-2 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                  Airbrush
                </h3>
              </div>
              <HoneycombGrid paints={airbrushPaints} />
            </div>
          )}

          {/* Brush section */}
          {brushPaints && brushPaints.length > 0 && (
            <div className="bg-slate-50 dark:bg-gray-900/40 rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-visible">
              <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-xl shadow-inner">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M9 2v6l-3 3.5V18a3 3 0 003 3 3 3 0 003-3v-6.5L9 8V2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                  Brush
                </h3>
              </div>
              <HoneycombGrid paints={brushPaints} />
            </div>
          )}

          {/* Speed section */}
          {speedPaints && speedPaints.length > 0 && (
            <div className="bg-slate-50 dark:bg-gray-900/40 rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-visible">
              <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl shadow-inner">
                  <svg
                    className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                  Speed
                </h3>
              </div>
              <HoneycombGrid paints={speedPaints} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
