import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, Timestamp } from "firebase/firestore";

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
  is_readable_online: boolean | null;
}

export const useMagazine = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("❌ No magazine ID provided");
      setLoading(false);
      return;
    }
    
    console.log(`🔍 Fetching magazine with ID: ${id}`);
    fetchMagazine();
  }, [id]);

  const fetchMagazine = async () => {
    if (!id) return;
    
    try {
      console.log(`📄 Fetching magazine document for ID: ${id}`);
      const docRef = doc(db, "magazines", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error(`❌ Magazine document not found for ID: ${id}`);
        toast({
          title: "Magazine Not Found",
          description: "The requested magazine could not be found.",
          variant: "destructive",
        });
        setMagazine(null);
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      console.log(`✅ Magazine document found:`, data);

      // Handle Firestore Timestamp conversion
      let created_at: string;
      if (data.created_at && typeof data.created_at === 'object' && data.created_at.toDate) {
        created_at = (data.created_at as Timestamp).toDate().toISOString();
      } else if (data.created_at && typeof data.created_at === 'string') {
        created_at = data.created_at;
      } else {
        created_at = new Date().toISOString();
      }

      const magazineData: Magazine = {
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
        is_readable_online: typeof data.is_readable_online === 'boolean' ? data.is_readable_online : false,
      };

      // Log detailed magazine info for debugging
      console.log(`📊 Magazine details:`);
      console.log(`  - Title: ${magazineData.title}`);
      console.log(`  - Is readable online: ${magazineData.is_readable_online}`);
      console.log(`  - File URL: ${magazineData.file_url || 'No file URL'}`);
      console.log(`  - File size: ${magazineData.file_size || 'Unknown'} bytes`);
      console.log(`  - Category: ${magazineData.category}`);

      // Check if magazine is readable online
      if (!magazineData.is_readable_online) {
        console.warn(`⚠️ Magazine is not set for online reading`);
        toast({
          title: "Access Denied",
          description: "This magazine is not available for online reading.",
          variant: "destructive",
        });
        // Don't navigate away - let the component handle this case
        setMagazine(magazineData); // Still set the magazine data
        setLoading(false);
        return;
      }

      // Validate file URL if present
      if (magazineData.file_url) {
        const isValid = isValidUrl(magazineData.file_url);
        const protocol = getUrlProtocol(magazineData.file_url);
        const domain = getUrlDomain(magazineData.file_url);
        
        console.log(`🔗 File URL validation:`);
        console.log(`  - URL: ${magazineData.file_url}`);
        console.log(`  - Valid: ${isValid}`);
        console.log(`  - Protocol: ${protocol}`);
        console.log(`  - Domain: ${domain}`);
        
        if (!isValid) {
          console.error(`❌ Invalid file URL format`);
          toast({
            title: "Invalid File URL",
            description: "The magazine file URL appears to be invalid.",
            variant: "destructive",
          });
        } else if (!magazineData.file_url.toLowerCase().includes('.pdf')) {
          console.warn(`⚠️ File URL does not appear to be a PDF`);
        }
      } else {
        console.warn(`⚠️ No file URL available for this magazine`);
        // Don't show a toast here - let the FlipBookViewer handle it
      }

      setMagazine(magazineData);
      console.log(`✅ Magazine data set successfully`);

    } catch (error: any) {
      console.error("❌ Error fetching magazine:", error);
      toast({
        title: "Error",
        description: `Failed to load the magazine: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      setMagazine(null);
    } finally {
      setLoading(false);
      console.log(`🏁 Magazine fetch completed`);
    }
  };

  return { magazine, loading };
};

// Helper functions for URL validation and analysis
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function getUrlProtocol(url: string): string {
  try {
    return new URL(url).protocol;
  } catch (_) {
    return "invalid";
  }
}

function getUrlDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return "invalid";
  }
}