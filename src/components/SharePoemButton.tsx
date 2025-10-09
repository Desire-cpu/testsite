import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

interface SharePoemButtonProps {
  poemId: string;
  authorId: string;
  title?: string;
}

const SharePoemButton: React.FC<SharePoemButtonProps> = ({ poemId, authorId, title }) => {
  const [copied, setCopied] = useState(false);
  const poemUrl = `${window.location.origin}/poem/${poemId}`;
  const artistUrl = `${window.location.origin}/artist/${authorId}`;
  const shareText = title
    ? `Read "${title}" and discover more poems by this artist: ${poemUrl}`
    : `Read this poem and discover more works by the artist: ${poemUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(poemUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || "Read this poem",
        text: shareText,
        url: poemUrl,
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
        title="Share poem"
        onClick={handleNativeShare}
        className="flex items-center"
      >
        <Share2 className="h-4 w-4 mr-1" />
        Share
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title={copied ? "Link Copied!" : "Copy poem link"}
        onClick={handleCopy}
        className={copied ? "text-primary" : ""}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SharePoemButton;