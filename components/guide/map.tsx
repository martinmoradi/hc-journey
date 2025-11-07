'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MapProps {
  zone: string; // Zone name in snake_case (e.g., "teldrassil", "elwynn_forest")
  x?: number; // X coordinate (0-100, up to 3 digits after decimal)
  y?: number; // Y coordinate (0-100, up to 3 digits after decimal)
}

interface MapContentProps {
  mapPath: string;
  displayName: string;
  showPin: boolean;
  x?: number;
  y?: number;
  isLarge?: boolean;
}

/**
 * MapContent - Renders the map image with optional pin marker
 * Extracted as a separate component to avoid creating components during render
 */
const MapContent: React.FC<MapContentProps> = ({
  mapPath,
  displayName,
  showPin,
  x,
  y,
  isLarge = false,
}) => {
  const pinSize = isLarge ? 32 : 24;
  const pinClassName = isLarge ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      {/* Map Image Container */}
      <div className="relative w-full aspect-1002/668">
        <Image
          src={mapPath}
          alt={`Map of ${displayName}`}
          fill
          className="object-contain"
          priority={isLarge}
          quality={isLarge ? 100 : 85}
          sizes={isLarge ? '90vw' : '100vw'}
          onError={(e) => {
            // Fallback if map doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Pin Marker - positioned based on 0-100 coordinate system */}
        {showPin && (
          <div
            className="absolute z-10 pointer-events-auto group"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            title={`${x?.toFixed(3)}, ${y?.toFixed(3)}`}
          >
            <div className={`relative ${pinClassName} -translate-x-1/2 -translate-y-full`}>
              <Image
                src="/assets/misc/mappoint.webp"
                alt="Map marker"
                width={pinSize}
                height={pinSize}
                className={`drop-shadow-lg ${isLarge ? 'animate-pulse' : ''}`}
              />
            </div>

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {x?.toFixed(3)}, {y?.toFixed(3)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Map - Displays the zone map image with optional pin marker
 * Maps are located at: /public/assets/maps/[zone].jpg
 * Expected size: ~1002x668px
 * Coordinates: 0-100 scale where 50,50 is center
 */
export const Map: React.FC<MapProps> = ({ zone, x, y }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Zone name mapping (extracted for better maintainability)
  const getZoneName = (zoneInput: string): string => {
    const zoneMap: Record<string, string> = {
      northshire: 'elwynn_forest',
      shadowglen: 'teldrassil',
      coldridge_valley: 'dun_morogh',
    };
    return zoneMap[zoneInput] || zoneInput;
  };

  const zoneName = getZoneName(zone);
  const mapPath = `/assets/maps/${zoneName}.jpg`;
  const displayName = zoneName.replace(/_/g, ' ');

  // Check if we should show the pin
  const showPin = typeof x === 'number' && typeof y === 'number';

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="w-full cursor-pointer transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          aria-label={`View larger map of ${displayName}`}
          type="button"
        >
          <MapContent mapPath={mapPath} displayName={displayName} showPin={showPin} x={x} y={y} />
        </button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[95vw] sm:max-w-[95vw] p-0 border-0 gap-0">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">{displayName}</DialogTitle>

        <MapContent
          mapPath={mapPath}
          displayName={displayName}
          showPin={showPin}
          x={x}
          y={y}
          isLarge
        />
      </DialogContent>
    </Dialog>
  );
};
