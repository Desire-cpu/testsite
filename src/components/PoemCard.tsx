import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import SharePoemButton from "./SharePoemButton";

interface PoemCardProps {
  poem: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author_id: string;
    author_name?: string;
  };
  onView: () => void;
  onDelete?: () => void;
}

const PoemCard: React.FC<PoemCardProps> = ({ poem, onView, onDelete }) => (
  <div className="group relative bg-card rounded-lg shadow hover:shadow-xl transition-shadow p-6 flex flex-col min-h-[260px] border border-border">
    <div>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs py-1 px-2">Poem</Badge>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <h3 className="font-bold text-lg text-primary mb-2 text-center font-serif">{poem.title}</h3>
      <div className="text-center font-serif text-base text-muted-foreground whitespace-pre-line leading-relaxed tracking-wide py-2 italic">
        {poem.content.length > 200
          ? poem.content.slice(0, 200) + "\n..."
          : poem.content}
      </div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{poem.author_name}</span>
      <SharePoemButton poemId={poem.id} authorId={poem.author_id} title={poem.title} />
    </div>
    <div className="mt-3 text-xs text-right text-muted-foreground">
      {new Date(poem.created_at).toLocaleDateString()}
    </div>
    <div className="absolute inset-0 pointer-events-none rounded-lg opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-primary/10 to-secondary/20" />
  </div>
);

export default PoemCard;