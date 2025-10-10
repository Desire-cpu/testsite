import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SharePoemButton from "@/components/SharePoemButton";

interface Poem {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
}

const PoemView: React.FC = () => {
  const { id } = useParams();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoem = async () => {
      if (!id) return;
      setLoading(true);
      const poemDoc = await getDoc(doc(db, "poems", id));
      if (poemDoc.exists()) {
        const data = poemDoc.data();
        setPoem({
          id: poemDoc.id,
          title: data.title,
          content: data.content,
          author_id: data.author_id,
          author_name: data.author_name,
          created_at: data.created_at,
        });
      }
      setLoading(false);
    };
    fetchPoem();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BookOpen className="h-12 w-12 text-muted-foreground animate-pulse" />
    </div>
  );
  if (!poem) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BookOpen className="h-12 w-12 text-destructive" />
      <div className="ml-4 text-lg text-destructive">Poem not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6 text-primary" onClick={() => navigate('/poems')}>
          ← Back to Poems
        </Button>
        <div className="bg-card rounded-lg shadow-xl p-8">
          <h2 className="font-bold text-3xl text-primary mb-4 text-center font-serif">{poem.title}</h2>
          <div className="text-muted-foreground mb-6 text-center">
            by {poem.author_name} • {new Date(poem.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center justify-center mt-3 mb-2 gap-2">
            <SharePoemButton poemId={poem.id} authorId={poem.author_id} title={poem.title} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/artist/${poem.author_id}`)}
              className="ml-2"
            >
              See Artist's Other Works
            </Button>
          </div>
          <div className="font-serif text-center text-lg text-primary whitespace-pre-line leading-relaxed tracking-wide py-2 italic">
            {poem.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoemView;