"use client";

import { useState } from "react";
import { SongCard, type SongCardProps } from "./song-card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Play,
  Pause,
  Music,
  Loader2,
  Download,
  X,
} from "lucide-react";
import { usePlayerStore } from "~/stores/use-player-store";
import { getPlayUrl } from "~/actions/generation";

interface SongGridProps {
  songs: Omit<SongCardProps, "onCardClick">[];
}

export function SongGrid({ songs }: SongGridProps) {
  const [selectedSong, setSelectedSong] = useState<SongCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { track, setTrack } = usePlayerStore();

  const handleCardClick = (song: SongCardProps) => {
    setSelectedSong(song);
  };

  const handlePlayPause = async (song: SongCardProps) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const playUrl = await getPlayUrl(song.id);

      setTrack({
        id: song.id,
        title: song.title,
        url: playUrl,
        artwork: song.thumbnailUrl,
        prompt: song.prompt,
        createdByUserName: song.createdByUserName,
      });
    } catch (error) {
      console.error("Failed to play track:", error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (song: SongCardProps) => {
    try {
      const playUrl = await getPlayUrl(song.id);
      window.open(playUrl, "_blank");
    } catch (error) {
      console.error("Failed to download track:", error instanceof Error ? error.message : String(error));
    }
  };

  const isCurrentTrack = (songId: string) => track?.id === songId;
  const isPlaying = (songId: string) => isCurrentTrack(songId) && track?.url;

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Music className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Songs Available</h2>
        <p className="text-muted-foreground">
          No published songs found. Check back later!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            {...song}
            onCardClick={() => handleCardClick(song)}
          />
        ))}
      </div>

      {selectedSong && (
        <Dialog open={!!selectedSong} onOpenChange={() => setSelectedSong(null)}>
          <DialogContent className="max-w-2xl p-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={() => setSelectedSong(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                {selectedSong.thumbnailUrl ? (
                  <img
                    src={selectedSong.thumbnailUrl}
                    alt={selectedSong.title ?? "Song thumbnail"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <Music className="h-24 w-24 text-white" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="rounded-full w-20 h-20 bg-white hover:bg-white/90 text-black shadow-lg"
                    onClick={() => handlePlayPause(selectedSong)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : isPlaying(selectedSong.id) ? (
                      <Pause className="h-8 w-8 fill-current" />
                    ) : (
                      <Play className="h-8 w-8 fill-current ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedSong.title ?? "Untitled"}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-2">
                      {selectedSong.createdByUserName}
                    </p>
                    <div className="flex gap-2 mb-4">
                      {selectedSong.instrumental && (
                        <Badge variant="outline">Instrumental</Badge>
                      )}
                      {selectedSong.published && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Published
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleDownload(selectedSong)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                {selectedSong.prompt && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {selectedSong.prompt}
                    </p>
                  </div>
                )}

                {selectedSong.lyrics && (
                  <div>
                    <h3 className="font-semibold mb-2">Lyrics</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {selectedSong.lyrics}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}