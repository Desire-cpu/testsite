import React, { useState } from "react";
import { db } from "@/integrations/firebase/client";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const storage = getStorage();

const UploadSongDialog: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(e.target.files?.[0] ?? null);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverImage(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to upload a song.");
      return;
    }
    if (!audioFile || !title.trim()) {
      setError("Title and audio file are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Upload audio
      const audioRef = ref(storage, `songs/${user.uid}/${Date.now()}_${audioFile.name}`);
      const audioUploadTask = uploadBytesResumable(audioRef, audioFile);
      await audioUploadTask;
      const audioUrl = await getDownloadURL(audioRef);

      // Upload cover image (optional)
      let coverImageUrl: string | null = null;
      if (coverImage) {
        const imageRef = ref(storage, `song_covers/${user.uid}/${Date.now()}_${coverImage.name}`);
        const imageUploadTask = uploadBytesResumable(imageRef, coverImage);
        await imageUploadTask;
        coverImageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "songs"), {
        title: title.trim(),
        description: description.trim(),
        audio_url: audioUrl,
        cover_image_url: coverImageUrl,
        artist_id: user.uid,
        artist_name: user.displayName || user.email || "Unknown",
        created_at: new Date().toISOString(),
      });
      setTitle("");
      setDescription("");
      setAudioFile(null);
      setCoverImage(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-card p-6 rounded-lg shadow max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-primary mb-2">Upload New Song</h2>
      {error && <div className="text-red-600 text-center">{error}</div>}
      <div>
        <label className="block font-semibold mb-1">Song Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded bg-background"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description (optional)</label>
        <textarea
          className="w-full px-3 py-2 border rounded bg-background"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Audio File (mp3, wav, etc.)</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          disabled={loading}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Cover Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Uploading..." : "Upload Song"}
      </Button>
    </form>
  );
};

export default UploadSongDialog;