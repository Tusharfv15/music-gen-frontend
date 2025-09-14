"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Play,
  Pause,
  Music,
  Loader2,
  MoreHorizontal,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePlayerStore } from "~/stores/use-player-store";
import { getPlayUrl } from "~/actions/generation";

export interface SongCardProps {
  id: string;
  title: string | null;
  createdAt: Date;
  instrumental: boolean;
  prompt: string | null;
  lyrics: string | null;
  describedLyrics: string | null;
  fullDescribedSong: string | null;
  thumbnailUrl: string | null;
  playUrl: string | null;
  status: string | null;
  createdByUserName: string | null;
  published: boolean;
  isOwnSong?: boolean;
  onCardClick?: () => void;
}

export function SongCard({
  id,
  title,
  thumbnailUrl,
  prompt,
  createdByUserName,
  instrumental,
  published,
  isOwnSong = false,
  onCardClick
}: SongCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { track, setTrack } = usePlayerStore();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentTrack = track?.id === id;
  const isPlaying = isCurrentTrack && track?.url;

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const playUrl = await getPlayUrl(id);

      setTrack({
        id,
        title,
        url: playUrl,
        artwork: thumbnailUrl,
        prompt,
        createdByUserName,
      });
    } catch (error) {
      console.error("Failed to play track:", error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    onCardClick?.();
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const playUrl = await getPlayUrl(id);
      window.open(playUrl, "_blank");
    } catch (error) {
      console.error("Failed to download track:", error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title ?? "Song thumbnail"}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
            <Music className="h-12 w-12 text-white" />
          </div>
        )}

        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
          isHovered || isCurrentTrack ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-white hover:bg-white/90 text-black shadow-lg"
            onClick={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="h-6 w-6 fill-current ml-0.5" />
            )}
          </Button>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
            {title ?? "Untitled"}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {prompt ?? "No description"}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isOwnSong ? "You" : createdByUserName}
          </p>
          <div className="flex gap-1">
            {isOwnSong && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Your Song
              </Badge>
            )}
            {instrumental && (
              <Badge variant="outline" className="text-xs">
                Instrumental
              </Badge>
            )}
            {published && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Published
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}