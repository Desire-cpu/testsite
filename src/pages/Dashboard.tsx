import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, FileText, Trash2, Calendar, Users, Eye, User, ChevronDown, Upload, RefreshCw, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UploadDialog from "@/components/UploadDialog";
import ShareButton from "@/components/ShareButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db, storage } from "@/integrations/firebase/client";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import PoemCard from "@/components/PoemCard";

interface Magazine {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
  file_size: number | null;
  file_url: string | null;
  cover_image_url: string | null;
  created_at: any;
  is_downloadable: boolean | null;
  is_readable_online: boolean | null;
  user_id: string;
}

interface Poem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Magazine state
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Poem state
  const [poems, setPoems] = useState<Poem[]>([]);
  const [poemsLoading, setPoemsLoading] = useState(true);

  // --- Fetch Magazines ---
  const fetchMagazines = useCallback(async (showRefreshToast = false) => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    if (showRefreshToast) setRefreshing(true);
    try {
      const magazinesQuery = query(
        collection(db, "magazines"),
        where("user_id", "==", user.uid)
      );
      const snapshot = await getDocs(magazinesQuery);
      const mags: Magazine[] = [];
      snapshot.forEach((docSnap) => {
        try {
          const data = docSnap.data() as Omit<Magazine, 'id'>;
          let createdAtString = "";
          if (data.created_at) {
            if (data.created_at.toDate) {
              createdAtString = data.created_at.toDate().toISOString();
            } else if (data.created_at.seconds) {
              createdAtString = new Date(data.created_at.seconds * 1000).toISOString();
            } else if (typeof data.created_at === 'string') {
              createdAtString = data.created_at;
            } else {
              createdAtString = new Date().toISOString();
            }
          } else {
            createdAtString = new Date().toISOString();
          }
          mags.push({
            ...data,
            id: docSnap.id,
            created_at: createdAtString,
          });
        } catch (docError) {
          console.error('Error processing document:', docSnap.id, docError);
        }
      });
      mags.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setMagazines(mags);
      if (showRefreshToast) {
        toast({
          title: "Refreshed",
          description: `Loaded ${mags.length} magazine(s)`,
        });
      }
    } catch (error) {
      let errorMessage = "Failed to load your magazines.";
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          errorMessage = "Permission denied. Please check your authentication.";
        } else if (error.message.includes('unavailable')) {
          errorMessage = "Service temporarily unavailable. Please try again.";
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid, toast]);

  // --- Fetch Poems ---
  const fetchPoems = useCallback(async () => {
    if (!user?.uid) {
      setPoemsLoading(false);
      return;
    }
    setPoemsLoading(true);
    try {
      const poemsQuery = query(
        collection(db, "poems"),
        where("author_id", "==", user.uid)
      );
      const snapshot = await getDocs(poemsQuery);
      const loaded: Poem[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          title: data.title,
          content: data.content,
          author_id: data.author_id,
          author_name: data.author_name,
          created_at: data.created_at,
        });
      });
      loaded.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPoems(loaded);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load your poems.",
        variant: "destructive",
      });
    } finally {
      setPoemsLoading(false);
    }
  }, [user?.uid, toast]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMagazines();
    fetchPoems();
  }, [user, navigate, fetchMagazines, fetchPoems]);

  // --- Delete Magazine ---
  const handleDelete = async (magazineId: string, fileName: string) => {
    if (!user?.uid) return;
    if (!window.confirm("Are you sure you want to delete this magazine? This action cannot be undone.")) {
      return;
    }
    try {
      const magDoc = magazines.find(m => m.id === magazineId);
      // Delete PDF from Storage - try multiple possible paths
      const possiblePaths = [
        `magazines/${user.uid}/${fileName}`,
        `magazines/${user.uid}/${fileName.split('/').pop()}`,
        fileName
      ];
      for (const path of possiblePaths) {
        try {
          const pdfRef = ref(storage, path);
          await deleteObject(pdfRef);
          break;
        } catch {}
      }
      // Delete cover image (if exists)
      if (magDoc?.cover_image_url) {
        try {
          const url = magDoc.cover_image_url;
          const matches = decodeURIComponent(url).match(/\/o\/(.*?)\?/);
          if (matches?.[1]) {
            const coverRef = ref(storage, matches[1]);
            await deleteObject(coverRef);
          }
        } catch {}
      }
      await deleteDoc(doc(db, "magazines", magazineId));
      toast({
        title: "Success",
        description: "Your magazine has been deleted successfully.",
      });
      fetchMagazines();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the magazine. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- Delete Poem ---
  const handleDeletePoem = async (poemId: string) => {
    if (!window.confirm("Are you sure you want to delete this poem? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "poems", poemId));
      toast({
        title: "Success",
        description: "Poem deleted.",
      });
      fetchPoems();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete poem.",
        variant: "destructive",
      });
    }
  };

  // --- Magazine actions ---
  const handleMagazineAction = (magazine: Magazine) => {
    if (magazine.is_readable_online && magazine.file_url) {
      navigate(`/magazine/${magazine.id}`);
    } else if (!magazine.is_readable_online) {
      toast({
        title: "Processing",
        description: "This magazine is still being processed. Please try again in a moment.",
        variant: "default",
      });
    } else {
      toast({
        title: "Not Available",
        description: "This magazine is not available for reading.",
        variant: "destructive",
      });
    }
  };

  const getActionButtonText = (magazine: Magazine) => {
    if (magazine.is_readable_online) return "Read Online";
    return "Processing...";
  };

  const getActionIcon = (magazine: Magazine) => {
    if (magazine.is_readable_online) return <Eye className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const handleRefresh = () => {
    fetchMagazines(true);
    fetchPoems();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center space-x-2 sm:space-x-3">
                <img src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" alt="Be Inspired Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Be Inspired</h1>
              </Button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Refresh button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              {/* Mobile-friendly upload button */}
              <div className="block sm:hidden">
                <UploadDialog 
                  triggerButton={
                    <Button size="sm" className="px-2">
                      <Upload className="h-4 w-4" />
                    </Button>
                  } 
                  onUploadSuccess={() => fetchMagazines()}
                />
              </div>
              <div className="hidden sm:block">
                <UploadDialog onUploadSuccess={() => fetchMagazines()} />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Welcome</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate('/'); }} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your uploaded magazines, poems, and view your reading statistics.
          </p>
          {/* Write a Poem Button */}
          <Button
            variant="outline"
            size="lg"
            className="mt-4"
            onClick={() => navigate('/write-poem')}
          >
            <BookOpen className="mr-2" />
            Write a Poem
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Magazines</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{magazines.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {magazines.filter(mag => {
                  try {
                    return new Date(mag.created_at).getMonth() === new Date().getMonth() &&
                           new Date(mag.created_at).getFullYear() === new Date().getFullYear();
                  } catch {
                    return false;
                  }
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(magazines.map(mag => mag.category).filter(Boolean)).size}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Magazines List */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>My Magazines</CardTitle>
            <CardDescription>
              All magazines you've uploaded to Be Inspired
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your magazines...</p>
              </div>
            ) : magazines.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't uploaded any magazines yet.
                </p>
                <UploadDialog onUploadSuccess={() => fetchMagazines()} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {magazines.map((magazine) => (
                  <Card key={magazine.id} className="hover:shadow-md transition-shadow">
                    {/* Cover Image */}
                    <div className="aspect-video overflow-hidden bg-muted/30 flex items-center justify-center">
                      {magazine.cover_image_url ? (
                        <img 
                          src={magazine.cover_image_url} 
                          alt={magazine.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png";
                            target.className = "h-12 w-12 text-muted-foreground";
                          }}
                        />
                      ) : (
                        <img 
                          src="/lovable-uploads/db348a0f-07e7-4e82-971d-f8103cc16cb3.png" 
                          alt="Be Inspired Logo" 
                          className="h-12 w-12 text-muted-foreground" 
                        />
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{magazine.category || 'Uncategorized'}</Badge>
                        <div className="flex items-center space-x-1">
                          <ShareButton 
                            magazineId={magazine.id}
                            artistId={user.uid}
                            title={magazine.title}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(magazine.id, magazine.file_name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{magazine.title}</CardTitle>
                      {magazine.description && (
                        <CardDescription className="line-clamp-2">
                          {magazine.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>File size:</span>
                          <span>{formatFileSize(magazine.file_size)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Uploaded:</span>
                          <span>{formatDate(magazine.created_at)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          <Badge variant={magazine.is_readable_online ? "default" : "secondary"} className="text-xs">
                            {magazine.is_readable_online ? "Available" : "Processing"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleMagazineAction(magazine)}
                          disabled={!magazine.is_readable_online}
                        >
                          {getActionIcon(magazine)}
                          <span className="ml-2">{getActionButtonText(magazine)}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Poems List */}
        <Card>
          <CardHeader>
            <CardTitle>My Poems</CardTitle>
            <CardDescription>
              All poems you've written for Be Inspired
            </CardDescription>
          </CardHeader>
          <CardContent>
            {poemsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your poems...</p>
              </div>
            ) : poems.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't written any poems yet.
                </p>
                <Button onClick={() => navigate('/write-poem')}>
                  Write a Poem
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {poems.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    onView={() => navigate(`/poem/${poem.id}`)}
                    onDelete={() => handleDeletePoem(poem.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;