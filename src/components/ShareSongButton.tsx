import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

interface ShareSongButtonProps {
  songId: string;
  artistId: string;
  title?: string;
}

const ShareSongButton: React.FC<ShareSongButtonProps> = ({ songId, artistId, title }) => {
  const [copied, setCopied] = useState(false);
  const songUrl = `${window.location.origin}/song/${songId}`;
  const shareText = title
    ? `Listen to "${title}" and discover more songs by this artist: ${songUrl}`
    : `Listen to this song and discover more works by the artist: ${songUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(songUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || "Listen to this song",
        text: shareText,
        url: songUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        title="Share song"
        onClick={handleNativeShare}
        className="flex items-center"
      >
        <Share2 className="h-4 w-4 mr-1" />
        Share
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title={copied ? "Link Copied!" : "Copy song link"}
        onClick={handleCopy}
        className={copied ? "text-primary" : ""}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShareSongButton;