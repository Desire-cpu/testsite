import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShareSongButton from "@/components/ShareSongButton";
import { ArrowLeft, User, Calendar, Music, Sparkles } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Music className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-muted/60 rounded w-24 mx-auto animate-pulse" />
            <p className="text-muted-foreground">Loading song...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Music className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-600">Song Not Found</h3>
          <p className="text-muted-foreground">The song you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/songs')} className="btn-modern">
            Browse Songs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" 
                alt="Be Inspired Logo" 
                className="h-8 w-8"
              />
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Be Inspired
              </h1>
            </button>
            <Button 
              onClick={() => navigate('/songs')}
              variant="outline"
              size="sm"
              className="btn-modern"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Songs
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6 text-primary hover:text-primary/80" 
            onClick={() => navigate('/songs')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Songs
          </Button>

          {/* Main Card */}
          <Card className="glass border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Cover Image Section */}
                <div className="relative aspect-square md:aspect-auto">
                  {song.cover_image_url ? (
                    <img 
                      src={song.cover_image_url} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500/20 via-orange-500/10 to-orange-600/20 flex items-center justify-center">
                      <Music className="h-32 w-32 text-primary/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Song Info Section */}
                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
                        {song.title}
                      </h2>
                      <Sparkles className="h-6 w-6 text-primary/60 flex-shrink-0 animate-pulse" />
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
                        <User className="h-4 w-4 text-primary" />
                        <button 
                          onClick={() => navigate(`/artist/${song.artist_id}`)}
                          className="hover:text-primary transition-colors"
                        >
                          {song.artist_name}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{new Date(song.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {song.description && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Description
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {song.description}
                      </p>
                    </div>
                  )}

                  {/* Audio Player */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Now Playing
                    </h3>
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-lg p-4 border border-primary/20">
                      <audio 
                        controls 
                        src={song.audio_url} 
                        className="w-full"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <ShareSongButton 
                      songId={song.id} 
                      artistId={song.artist_id} 
                      title={song.title} 
                    />
                    <Button
                      variant="outline"
                      className="flex-1 btn-modern"
                      onClick={() => navigate(`/artist/${song.artist_id}`)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Artist Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card className="glass border-0 mt-6">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <Music className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-lg font-semibold">Enjoying this song?</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Check out more amazing music from {song.artist_name} and other talented artists on Be Inspired.
                </p>
                <Button 
                  onClick={() => navigate('/songs')}
                  className="btn-modern bg-gradient-to-r from-primary to-primary/80"
                >
                  Discover More Songs
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" 
              alt="Be Inspired Logo" 
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-primary">Be Inspired</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Be Inspired. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SongView;