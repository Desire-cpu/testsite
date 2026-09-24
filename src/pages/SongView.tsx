import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import ShareSongButton from "@/components/ShareSongButton";

interface Song {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  audio_url: string;
  cover_image_url?: string;
  created_at: string;
  description?: string;
}

const SongView: React.FC = () => {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSong = async () => {
      if (!id) return;
      setLoading(true);
      const songDoc = await getDoc(doc(db, "songs", id));
      if (songDoc.exists()) {
        const data = songDoc.data();
        setSong({
          id: songDoc.id,
          title: data.title,
          artist_id: data.artist_id,
          artist_name: data.artist_name,
          audio_url: data.audio_url,
          cover_image_url: data.cover_image_url,
          created_at: data.created_at,
          description: data.description,
        });
      }
      setLoading(false);
    };
    fetchSong();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!song) return <div className="min-h-screen flex items-center justify-center">Song not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6 text-primary" onClick={() => navigate('/songs')}>
          ← Back to Songs
        </Button>
        <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center">
          {song.cover_image_url && (
            <img src={song.cover_image_url} alt={song.title} className="rounded w-40 h-40 object-cover mb-4" />
          )}
          <h2 className="font-bold text-3xl text-primary mb-2 text-center">{song.title}</h2>
          <div className="text-muted-foreground mb-4 text-center">
            by {song.artist_name} • {new Date(song.created_at).toLocaleDateString()}
          </div>
          <audio controls src={song.audio_url} className="w-full mb-4">
            Your browser does not support the audio element.
          </audio>
          <ShareSongButton songId={song.id} artistId={song.artist_id} title={song.title} />
          {song.description && (
            <p className="mt-4 text-sm text-muted-foreground text-center">{song.description}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate(`/artist/${song.artist_id}`)}
          >
            See Artist's Other Works
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SongView;