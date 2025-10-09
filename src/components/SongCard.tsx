import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Share2 } from "lucide-react";
import ShareSongButton from "./ShareSongButton";

interface SongCardProps {
  song: {
    id: string;
    title: string;
    artist_id: string;
    artist_name?: string;
    audio_url: string;
    cover_image_url?: string;
    created_at: string;
    description?: string;
  };
  onPlay: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPlay }) => (
  <div className="bg-card rounded-lg shadow p-5 flex flex-col items-center border border-border">
    {song.cover_image_url ? (
      <img src={song.cover_image_url} alt={song.title} className="rounded w-32 h-32 object-cover mb-3" />
    ) : (
      <div className="w-32 h-32 bg-muted rounded mb-3 flex items-center justify-center">
        <Play className="h-8 w-8 text-primary" />
      </div>
    )}
    <h3 className="font-bold text-lg text-primary mb-1 text-center">{song.title}</h3>
    <div className="text-xs text-muted-foreground mb-2 text-center">
      {song.artist_name || "Unknown Artist"} • {new Date(song.created_at).toLocaleDateString()}
    </div>
    <Button variant="outline" size="sm" className="mb-2 w-full" onClick={onPlay}>
      <Play className="h-4 w-4 mr-1" /> Listen
    </Button>
    <ShareSongButton songId={song.id} artistId={song.artist_id} title={song.title} />
    {song.description && (
      <p className="mt-3 text-xs text-muted-foreground text-center">{song.description}</p>
    )}
  </div>
);

export default SongCard;