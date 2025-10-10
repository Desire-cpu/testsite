
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Magazine {
  title: string;
  description: string | null;
  category: string;
  file_size: number | null;
}

interface MagazineInfoProps {
  magazine: Magazine;
}

const MagazineInfo: React.FC<MagazineInfoProps> = ({ magazine }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">{magazine.title}</CardTitle>
        {magazine.description && (
          <p className="text-muted-foreground">{magazine.description}</p>
        )}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Category: {magazine.category}</span>
          <span>Size: {magazine.file_size ? (magazine.file_size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown'}</span>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MagazineInfo;
