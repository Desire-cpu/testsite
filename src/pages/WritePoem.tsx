import React, { useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const WritePoem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-lg shadow max-w-md mx-auto text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-2" />
          <p className="mb-4 text-lg text-muted-foreground">You need to be logged in to write a poem.</p>
          <Button className="w-full" onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and poem are required.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "poems"), {
        title: title.trim(),
        content: content.trim(),
        author_id: user.uid,
        author_name: user.displayName || user.email || "Unknown",
        created_at: new Date().toISOString(),
      });
      navigate("/poems");
    } catch (err) {
      setError("Failed to submit poem. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/10 flex items-center justify-center py-8 px-4">
      <form
        className="bg-card rounded-lg shadow-xl p-8 max-w-xl w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-6">
          <BookOpen className="h-10 w-10 text-primary mx-auto mb-2 animate-float" />
          <h2 className="font-bold text-2xl text-primary mb-1 font-serif">Share Your Poem</h2>
          <p className="text-muted-foreground">Express yourself! All fields below are required.</p>
        </div>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-primary">Title</label>
          <input
            className="w-full px-3 py-2 border rounded bg-background text-primary font-serif"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
            maxLength={120}
            required
            placeholder="Poem Title"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-primary">Poem</label>
          <textarea
            className="w-full px-3 py-2 border rounded bg-background text-primary font-serif min-h-[160px] leading-relaxed tracking-wide"
            value={content}
            onChange={e => setContent(e.target.value)}
            disabled={loading}
            required
            maxLength={2048}
            placeholder="Write your poem here. Line breaks will be preserved."
          />
        </div>
        <Button
          className="w-full font-semibold text-lg py-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Poem"}
        </Button>
      </form>
    </div>
  );
};

export default WritePoem;