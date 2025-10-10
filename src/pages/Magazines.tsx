import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import ShareButton from "@/components/ShareButton";
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";

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
  user_id: string;
  is_downloadable: boolean | null;
  is_readable_online: boolean | null;
  profiles?: {
    artist_name: string | null;
  } | null;
}

const Magazines = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMagazines();
    // eslint-disable-next-line
  }, []);

  const fetchMagazines = async () => {
    try {
      const magazinesQuery = query(
        collection(db, "magazines"),
        orderBy("created_at", "desc")
      );
      const magazinesSnap = await getDocs(magazinesQuery);

      const magazinesData: Magazine[] = [];

      for (const docSnap of magazinesSnap.docs) {
        const mag = docSnap.data() as Magazine;
        mag.id = docSnap.id;

        // Fetch artist profile
        let artistProfile: { artist_name: string | null } | null = null;
        try {
          const profileDoc = await getDoc(doc(db, "profiles", mag.user_id));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            artistProfile = { artist_name: profileData.artist_name || null };
          }
        } catch (err) {
          artistProfile = null;
        }
        magazinesData.push({ ...mag, profiles: artistProfile });
      }
      setMagazines(magazinesData);
    } catch (error) {
      console.error("Error fetching magazines:", error);
      toast({
        title: "Error",
        description: "Failed to load magazines.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagazineAction = (magazine: Magazine) => {
    if (magazine.is_readable_online) {
      navigate(`/magazine/${magazine.id}`);
    } else {
      toast({
        title: "Not Available",
        description: "This magazine is not available for online reading.",
        variant: "destructive",
      });
    }
  };

  const navigateToArtist = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 sm:h-4 bg-muted rounded w-24 sm:w-32 mx-auto animate-pulse" />
            <div className="h-2 sm:h-3 bg-muted/60 rounded w-16 sm:w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Be Inspired</h1>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="btn-modern text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="btn-modern bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-xs sm:text-sm px-2 sm:px-3"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            All Magazines
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Discover and explore our complete collection of creative digital magazines
          </p>
        </div>

        {magazines.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="max-w-md mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold">No magazines available</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Be the first to upload and share your creative work!</p>
              </div>
              <Button
                onClick={() => navigate("/auth")}
                className="btn-modern bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
              >
                Get Started
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {magazines.map((magazine) => (
              <Card key={magazine.id} className="card-hover glass border-0 overflow-hidden group">
                <div className="aspect-[3/4] relative overflow-hidden">
                  {magazine.cover_image_url ? (
                    <img
                      src={magazine.cover_image_url}
                      alt={magazine.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-500">
                      <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary/60 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {magazine.title}
                  </h3>
                  {magazine.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {magazine.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-2 sm:px-3 py-1 rounded-full border border-primary/20">
                      {magazine.category}
                    </span>
                    <button
                      onClick={() => navigateToArtist(magazine.user_id)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors truncate max-w-20 sm:max-w-none"
                    >
                      by {magazine.profiles?.artist_name || "Unknown Artist"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {magazine.is_readable_online && (
                      <Button
                        size="sm"
                        className="flex-1 btn-modern bg-gradient-to-r from-primary to-primary/80 text-xs sm:text-sm py-1 sm:py-2"
                        onClick={() => handleMagazineAction(magazine)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Read
                      </Button>
                    )}
                    <ShareButton
                      magazineId={magazine.id}
                      artistId={magazine.user_id}
                      title={magazine.title}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Magazines;