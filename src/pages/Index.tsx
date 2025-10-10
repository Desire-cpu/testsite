import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Eye, Sparkles, Users, FolderOpen, Menu, X, Feather } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import ShareButton from "@/components/ShareButton";
import { collection, getDocs, query, orderBy, getDoc, doc, Timestamp } from "firebase/firestore";

// ------ Interfaces ------
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
  artist_name?: string | null;
}

interface Poem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

// ------ Main Component ------
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [poemsLoading, setPoemsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalMagazines: 0,
    registeredUsers: 0,
    totalCategories: 0,
    totalPoems: 0,
  });

  useEffect(() => {
    fetchMagazines();
    fetchStats();
    fetchPoems();
  }, []);

  // ----- Fetch Magazines -----
  const fetchMagazines = async () => {
    try {
      setError(null);
      const magazinesQuery = query(
        collection(db, "magazines"),
        orderBy("created_at", "desc")
      );
      const magazinesSnapshot = await getDocs(magazinesQuery);

      if (magazinesSnapshot.empty) {
        setMagazines([]);
        return;
      }

      const magazineData: Magazine[] = [];
      const userIds: Set<string> = new Set();

      magazinesSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        let created_at: string;
        if (data.created_at && typeof data.created_at === 'object' && data.created_at.toDate) {
          created_at = (data.created_at as Timestamp).toDate().toISOString();
        } else if (data.created_at && typeof data.created_at === 'string') {
          created_at = data.created_at;
        } else {
          created_at = new Date().toISOString();
        }
        const magazine: Magazine = {
          id: docSnap.id,
          title: data.title || 'Untitled',
          description: data.description || null,
          category: data.category || 'Uncategorized',
          file_name: data.file_name || '',
          file_size: typeof data.file_size === 'number' ? data.file_size : null,
          file_url: data.file_url || null,
          cover_image_url: data.cover_image_url || null,
          created_at,
          user_id: data.user_id || '',
          is_downloadable: typeof data.is_downloadable === 'boolean' ? data.is_downloadable : false,
          is_readable_online: typeof data.is_readable_online === 'boolean' ? data.is_readable_online : false,
        };
        magazineData.push(magazine);
        if (data.user_id) {
          userIds.add(data.user_id);
        }
      });

      // Get artist names from profiles collection
      const artistNameMap = new Map<string, string | null>();
      const profilePromises = Array.from(userIds).map(async (userId) => {
        try {
          const profileDoc = await getDoc(doc(db, "profiles", userId));
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            const artistName = profileData.artist_name || null;
            artistNameMap.set(userId, artistName);
          } else {
            artistNameMap.set(userId, null);
          }
        } catch {
          artistNameMap.set(userId, null);
        }
      });
      await Promise.all(profilePromises);

      // Attach artist names to magazines
      const magazinesWithArtists = magazineData.map(magazine => ({
        ...magazine,
        artist_name: artistNameMap.get(magazine.user_id) || null,
      }));
      setMagazines(magazinesWithArtists);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load magazines: ${errorMessage}`);
      toast({
        title: "Error Loading Magazines",
        description: `Failed to load magazines: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ----- Fetch Poems -----
  const fetchPoems = async () => {
    setPoemsLoading(true);
    try {
      const poemsQuery = query(collection(db, "poems"), orderBy("created_at", "desc"));
      const snapshot = await getDocs(poemsQuery);
      const loaded: Poem[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        loaded.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          author_id: data.author_id,
          author_name: data.author_name,
          created_at: data.created_at,
        });
      });
      setPoems(loaded);
      setStats(prev => ({ ...prev, totalPoems: loaded.length }));
    } catch (err) {
      // handle error
    } finally {
      setPoemsLoading(false);
    }
  };

  // ----- Fetch Stats -----
  const fetchStats = async () => {
    try {
      const magazinesSnapshot = await getDocs(collection(db, "magazines"));
      const totalMagazines = magazinesSnapshot.size;
      const profilesSnapshot = await getDocs(collection(db, "profiles"));
      const registeredUsers = profilesSnapshot.size;
      const poemsSnapshot = await getDocs(collection(db, "poems"));
      const totalPoems = poemsSnapshot.size;
      setStats({
        totalMagazines,
        registeredUsers,
        totalCategories: 5,
        totalPoems,
      });
    } catch (error) {}
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

  const navigateToArtist = (artistId: string, magazineId?: string) => {
    if (magazineId) {
      navigate(`/artist/${artistId}/magazine/${magazineId}`);
    } else {
      navigate(`/artist/${artistId}`);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-600">Error Loading Content</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => {
            setError(null);
            setLoading(true);
            fetchMagazines();
          }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <img src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" alt="Be Inspired Logo" className="h-16 w-16 sm:h-24 sm:w-24 mx-auto animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 sm:h-4 bg-muted rounded w-24 sm:w-32 mx-auto animate-pulse" />
            <div className="h-2 sm:h-3 bg-muted/60 rounded w-16 sm:w-24 mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading magazines...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Improved Mobile-First Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <div className="relative">
                <img 
                  src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" 
                  alt="Be Inspired Logo" 
                  className="h-8 w-8 animate-float cursor-pointer" 
                  onClick={() => handleNavigation('/')}
                />
                <Sparkles className="h-3 w-3 text-primary/60 absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
              <h1 
                className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer"
                onClick={() => handleNavigation('/')}
              >
                Be Inspired
              </h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => navigate('/about')} className="btn-modern text-sm px-3">About</Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/contact')} className="btn-modern text-sm px-3">Contact</Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="btn-modern text-sm px-3">Dashboard</Button>
              <Button onClick={() => navigate('/auth')} className="btn-modern bg-gradient-to-r from-primary to-primary/80 text-sm px-3">Sign Up</Button>
            </div>
            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-border/50 space-y-2">
              <Button variant="ghost" size="sm" onClick={() => handleNavigation('/about')} className="w-full justify-start text-sm">About</Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation('/contact')} className="w-full justify-start text-sm">Contact</Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation('/dashboard')} className="w-full justify-start text-sm">Dashboard</Button>
              <Button onClick={() => handleNavigation('/auth')} className="w-full btn-modern bg-gradient-to-r from-primary to-primary/80 text-sm mt-2">Sign Up</Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 xl:py-32 overflow-hidden px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              Discover and Share Creative Magazines & Poems
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Explore a vast collection of digital magazines and heartfelt poems created by talented artists from around the world.
              Share your favorites and connect with the creative community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-0">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="btn-modern bg-gradient-to-r from-primary to-primary/80 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg h-auto w-full sm:w-auto"
              >
                Get Started
                <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/magazines')}
                className="btn-modern px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg h-auto border-2 w-full sm:w-auto"
              >
                Explore Magazines
                <BookOpen className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              {/* NEW: Explore Poems Button */}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/poems')}
                className="btn-modern px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg h-auto border-2 w-full sm:w-auto"
              >
                Explore Poems
                <Feather className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-60 pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Magazines */}
            <Card className="card-hover glass border-0 text-center">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{stats.totalMagazines}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">Magazines Published</p>
              </CardContent>
            </Card>
            {/* Artists */}
            <Card className="card-hover glass border-0 text-center">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{stats.registeredUsers}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">Registered Artists</p>
              </CardContent>
            </Card>
            {/* Categories */}
            <Card className="card-hover glass border-0 text-center">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-orange-600 flex items-center justify-center mb-3 sm:mb-4">
                  <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{stats.totalCategories}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">Categories</p>
              </CardContent>
            </Card>
            {/* NEW: Poems */}
            <Card className="card-hover glass border-0 text-center">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-blue-400 flex items-center justify-center mb-3 sm:mb-4">
                  <Feather className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{stats.totalPoems}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">Poems Shared</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Magazines Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">Latest Magazines</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
              Discover the latest creative works from talented artists around the world
            </p>
          </div>
          {magazines.length === 0 ? (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="max-w-md mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold">No magazines yet</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">Be the first to upload and share your creative work!</p>
                </div>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="btn-modern bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {magazines.map((magazine) => (
                <Card key={magazine.id} className="card-hover glass border-0 overflow-hidden group">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {magazine.cover_image_url ? (
                      <img
                        src={magazine.cover_image_url}
                        alt={magazine.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-500">
                        <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary/60 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
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
                        title={magazine.artist_name || 'Unknown Artist'}
                      >
                        by {magazine.artist_name || 'Unknown Artist'}
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
        </div>
      </section>

      {/* NEW: Latest Poems Section */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20 px-3 sm:px-0">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">Latest Poems</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
              Read the latest creative poems from our artists
            </p>
          </div>
          {poemsLoading ? (
            <div className="text-center py-12">
              <Feather className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground text-lg">Loading poems...</p>
            </div>
          ) : poems.length === 0 ? (
            <div className="text-center py-12">
              <Feather className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                No poems yet. Be the first to inspire!
              </p>
              <Button onClick={() => navigate('/write-poem')}>
                Write a Poem
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {poems.slice(0, 6).map(poem => (
                <Card key={poem.id} className="card-hover glass border-0 overflow-hidden group">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg text-primary text-center font-serif">{poem.title}</h3>
                    <div className="font-serif text-base text-muted-foreground whitespace-pre-line text-center italic leading-relaxed mb-2">
                      {poem.content.length > 160
                        ? poem.content.slice(0, 160) + "\n..."
                        : poem.content}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-2 py-1 rounded-full border border-primary/20">
                        {poem.author_name || 'Unknown Artist'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/poem/${poem.id}`)}
                        className="text-primary"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold text-lg"
              onClick={() => navigate('/poems')}
            >
              See All Poems
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
              Join Our Community of Creative Artists
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed px-2 sm:px-0">
              Showcase your work, connect with fellow artists, and inspire the world with your creativity.
              Sign up today and start sharing your digital magazines and poems!
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="btn-modern bg-white text-primary px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg h-auto font-semibold w-full sm:w-auto"
            >
              Get Started
              <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <img src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" alt="Be Inspired Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-base sm:text-lg font-semibold text-primary">Be Inspired</span>
          </div>
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4">
            <button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">About</button>
            <button onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Contact</button>
            <button onClick={() => navigate('/magazines')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Magazines</button>
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Dashboard</button>
            <button onClick={() => navigate('/poems')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Poems</button>
            <button onClick={() => navigate('/songs')} className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">Songs</button>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Be Inspired. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;