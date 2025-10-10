import React, { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SongCard from "@/components/SongCard";
import UploadSongDialog from "@/components/UploadSongDialog";
import { Music } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist_id: string;
  artist_name?: string;
  audio_url: string;
  cover_image_url?: string;
  created_at: string;
  description?: string;
}

const Songs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const songsQuery = query(collection(db, "songs"), orderBy("created_at", "desc"));
      const snapshot = await getDocs(songsQuery);
      const loaded: Song[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        loaded.push({
          id: doc.id,
          title: data.title,
          artist_id: data.artist_id,
          artist_name: data.artist_name,
          audio_url: data.audio_url,
          cover_image_url: data.cover_image_url,
          created_at: data.created_at,
          description: data.description,
        });
      });
      setSongs(loaded);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <Music className="h-10 w-10 text-primary mx-auto mb-2 animate-float" />
          <h2 className="font-bold text-3xl text-primary mb-2">Latest Songs</h2>
          <Button onClick={() => setShowUpload(true)} className="font-semibold px-6 py-2 text-lg">
            Upload a Song
          </Button>
        </div>
        {showUpload && (
          <div className="mb-8">
            <UploadSongDialog onSuccess={() => setShowUpload(false)} />
          </div>
        )}
        {loading ? (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground text-lg">Loading songs...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              No songs yet. Be the first to inspire!
            </p>
            <Button onClick={() => setShowUpload(true)}>Upload a Song</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {songs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={() => navigate(`/song/${song.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs;