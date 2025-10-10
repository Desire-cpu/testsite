import React, { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PoemCard from "@/components/PoemCard";

interface Poem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

const Poems: React.FC = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoems = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    fetchPoems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <BookOpen className="h-10 w-10 text-primary mx-auto mb-2 animate-float" />
          <h2 className="font-bold text-3xl text-primary mb-2 font-serif">Poems Gallery</h2>
          <p className="text-muted-foreground mb-4">
            Discover, share, and be inspired by poems from our creative community.
          </p>
          <Button
            className="font-semibold px-6 py-2 text-lg"
            onClick={() => navigate('/write-poem')}
          >
            <Sparkles className="mr-2" />
            Write a Poem
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground text-lg">Loading poems...</p>
          </div>
        ) : poems.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              No poems yet. Be the first to inspire!
            </p>
            <Button onClick={() => navigate('/write-poem')}>
              Write a Poem
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {poems.map(poem => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onView={() => navigate(`/poem/${poem.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Poems;