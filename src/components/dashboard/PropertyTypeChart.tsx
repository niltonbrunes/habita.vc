"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import { RefreshCcw } from 'lucide-react';

export function PropertyTypeChart() {
  const [data, setData] = useState<{ name: string, value: number, color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await DashboardService.getPropertiesByType();
        setData(result);
      } catch (err) {
        console.error('Failed to load property types', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[300px]">
        <RefreshCcw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[300px] text-sm text-muted-foreground">
        Nenhum imóvel cadastrado.
      </div>
    );
  }

  // Calculate SVG Paths for Donut
  const SVG_SIZE = 220;
  const CENTER = SVG_SIZE / 2;
  const RADIUS = 75; // Outer radius of the donut hole
  const STROKE_WIDTH = 45; // Thickness of the donut

  let cumulativePercent = 0;

  const slices = data.map((slice, i) => {
    const percent = slice.value / total;
    
    // For SVG stroke-dasharray approach:
    const circumference = 2 * Math.PI * RADIUS;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    
    cumulativePercent += percent;

    return (
      <circle
        key={slice.name}
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="transparent"
        stroke={slice.color}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="butt"
        className="transition-all duration-300 cursor-pointer origin-center"
        style={{
          transform: hoveredIndex === i ? 'scale(1.03)' : 'scale(1)',
          opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1,
        }}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      />
    );
  });

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-4 relative">
      {/* Legenda (Legend) */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mb-8 max-w-[95%]">
        {data.map((item, i) => (
          <div 
            key={item.name} 
            className="flex items-center gap-2 cursor-pointer transition-opacity"
            style={{ opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-8 h-3 rounded-sm shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-semibold text-slate-600 truncate max-w-[140px]">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* SVG Donut Chart */}
      <div className="relative w-[220px] h-[220px]">
        {/* We rotate the SVG -90deg so the first slice starts at 12 o'clock */}
        <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
          {slices}
          
          {/* White gaps to mimic screenshot */}
          {data.map((slice, i) => {
            const currentCumu = data.slice(0, i).reduce((sum, d) => sum + d.value, 0) / total;
            const angle = currentCumu * 360;
            const outerR = RADIUS + (STROKE_WIDTH / 2);
            const innerR = RADIUS - (STROKE_WIDTH / 2);
            const rad = (angle * Math.PI) / 180;
            const x1 = CENTER + innerR * Math.cos(rad);
            const y1 = CENTER + innerR * Math.sin(rad);
            const x2 = CENTER + outerR * Math.cos(rad);
            const y2 = CENTER + outerR * Math.sin(rad);

            return (
              <line 
                key={`gap-${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="white"
                strokeWidth="4"
                className="pointer-events-none"
              />
            );
          })}
        </svg>

        {/* Center Hover Text */}
        {hoveredIndex !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-slate-800 leading-none">
              {data[hoveredIndex].value}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1 text-center px-4 leading-tight">
              {data[hoveredIndex].name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
