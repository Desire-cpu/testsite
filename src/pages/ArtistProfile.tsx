import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Download, Eye, Globe, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

interface Artist {
  id: string;
  artist_name: string;
  full_name: string;
  bio: string | null;
  website: string | null;
  social_links: any;
}

interface Magazine {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
  file_size: number | null;
  file_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  is_downloadable: boolean | null;
  is_readable_online: boolean | null;
}

const ArtistProfile = () => {
  const { artistId, magazineId } = useParams<{ artistId: string; magazineId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredMagazine, setFeaturedMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    if (!artistId) {
      navigate('/');
      return;
    }
    fetchArtistData();
    // eslint-disable-next-line
  }, [artistId, magazineId, navigate]);

  const fetchArtistData = async () => {
    setLoading(true);
    try {
      // Fetch artist profile from Firestore
      const artistDocRef = doc(db, "profiles", artistId);
      const artistSnap = await getDoc(artistDocRef);
      if (!artistSnap.exists()) {
        setArtist(null);
        throw new Error("Artist not found");
      }
      setArtist(artistSnap.data() as Artist);

      // Fetch artist's magazines from Firestore
      const magazinesQuery = query(
        collection(db, "magazines"),
        where("user_id", "==", artistId),
        orderBy("created_at", "desc")
      );
      const magsSnap = await getDocs(magazinesQuery);
      const mags: Magazine[] = [];
      magsSnap.forEach(docSnap => {
        const data = docSnap.data() as Magazine;
        mags.push({ ...data, id: docSnap.id });
      });
      setMagazines(mags);

      // Featured magazine by id
      if (magazineId) {
        const featured = mags.find(mag => mag.id === magazineId);
        setFeaturedMagazine(featured || null);
      }
    } catch (error: any) {
      console.error('Error fetching artist data:', error);
      toast({
        title: "Error",
        description: "Failed to load artist profile.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleMagazineAction = (magazine: Magazine, action: 'view' | 'download') => {
    if (action === 'view' && magazine.is_readable_online) {
      navigate(`/magazine/${magazine.id}`);
    } else if (action === 'download' && magazine.is_downloadable && magazine.file_url) {
      window.open(magazine.file_url, '_blank');
    } else {
      toast({
        title: "Action Not Available",
        description: `This magazine is not available for ${action === 'view' ? 'online reading' : 'download'}.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Artist not found.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-primary">ThizaGraphix</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Artist Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{artist.artist_name}</CardTitle>
            {artist.full_name && artist.full_name !== artist.artist_name && (
              <p className="text-lg text-muted-foreground">{artist.full_name}</p>
            )}
            {artist.bio && (
              <p className="text-muted-foreground">{artist.bio}</p>
            )}
            <div className="flex items-center space-x-4 mt-4">
              {artist.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={artist.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Featured Magazine */}
        {featuredMagazine && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Featured Magazine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  {featuredMagazine.cover_image_url ? (
                    <img
                      src={featuredMagazine.cover_image_url}
                      alt={featuredMagazine.title}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-2">{featuredMagazine.title}</h3>
                  {featuredMagazine.description && (
                    <p className="text-muted-foreground mb-4">{featuredMagazine.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span>Category: {featuredMagazine.category}</span>
                    <span>Size: {featuredMagazine.file_size ? (featuredMagazine.file_size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown'}</span>
                  </div>
                  <div className="flex space-x-2">
                    {featuredMagazine.is_readable_online && (
                      <Button onClick={() => handleMagazineAction(featuredMagazine, 'view')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Read Online
                      </Button>
                    )}
                    {featuredMagazine.is_downloadable && (
                      <Button variant="outline" onClick={() => handleMagazineAction(featuredMagazine, 'download')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Magazines */}
        <Card>
          <CardHeader>
            <CardTitle>All Magazines by {artist.artist_name}</CardTitle>
          </CardHeader>
          <CardContent>
            {magazines.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No magazines published yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {magazines.map((magazine) => (
                  <Card key={magazine.id} className="overflow-hidden">
                    <div className="aspect-[3/4] relative">
                      {magazine.cover_image_url ? (
                        <img
                          src={magazine.cover_image_url}
                          alt={magazine.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{magazine.title}</h3>
                      {magazine.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{magazine.description}</p>
                      )}
                      <div className="flex space-x-2">
                        {magazine.is_readable_online && (
                          <Button size="sm" onClick={() => handleMagazineAction(magazine, 'view')}>
                            <Eye className="h-3 w-3 mr-1" />
                            Read
                          </Button>
                        )}
                        {magazine.is_downloadable && (
                          <Button size="sm" variant="outline" onClick={() => handleMagazineAction(magazine, 'download')}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistProfile;