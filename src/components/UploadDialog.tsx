import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/integrations/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";

interface UploadFormData {
  title: string;
  description: string;
  category: string;
}

interface UploadDialogProps {
  triggerButton?: React.ReactNode;
}

const UploadDialog = ({ triggerButton }: UploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<UploadFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  const categories = ["Technology", "Design", "Business", "Science", "Health", "Travel"];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        // Auto-populate title if empty
        if (!form.getValues("title")) {
          form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        // Clear the input
        event.target.value = "";
      }
    }
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedCoverImage(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.).",
          variant: "destructive",
        });
        // Clear the input
        event.target.value = "";
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("pdf-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const removeCoverImage = () => {
    setSelectedCoverImage(null);
    const coverInput = document.getElementById("cover-upload") as HTMLInputElement;
    if (coverInput) {
      coverInput.value = "";
    }
  };

  const resetDialog = () => {
    form.reset();
    setSelectedFile(null);
    setSelectedCoverImage(null);
    setIsUploading(false);
    
    // Clear file inputs
    const fileInput = document.getElementById("pdf-upload") as HTMLInputElement;
    const coverInput = document.getElementById("cover-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    if (coverInput) coverInput.value = "";
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please make sure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!data.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your magazine.",
        variant: "destructive",
      });
      return;
    }

    if (!data.category) {
      toast({
        title: "Category Required",
        description: "Please select a category for your magazine.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = selectedFile.name.split('.').pop() || 'pdf';
      const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `magazines/${user.uid}/${timestamp}_${sanitizedFileName}`;
      
      // Upload PDF file to Firebase Storage
      const pdfRef = ref(storage, fileName);
      const pdfSnapshot = await uploadBytes(pdfRef, selectedFile);
      const pdfUrl = await getDownloadURL(pdfSnapshot.ref);

      let coverImageUrl = null;
      if (selectedCoverImage) {
        try {
          // Upload cover image to Firebase Storage
          const coverExt = selectedCoverImage.name.split('.').pop() || 'jpg';
          const sanitizedCoverName = selectedCoverImage.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const coverFileName = `magazines/covers/${user.uid}/${timestamp}_${sanitizedCoverName}`;
          const coverRef = ref(storage, coverFileName);
          const coverSnapshot = await uploadBytes(coverRef, selectedCoverImage);
          coverImageUrl = await getDownloadURL(coverSnapshot.ref);
        } catch (coverError) {
          console.error('Cover image upload failed:', coverError);
          // Continue without cover image
        }
      }

      // Save magazine metadata to Firestore
      const magazineData = {
        user_id: user.uid,
        title: data.title.trim(),
        description: data.description.trim() || null,
        category: data.category,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_url: pdfUrl,
        cover_image_url: coverImageUrl,
        is_downloadable: false,
        is_readable_online: true,
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, "magazines"), magazineData);

      toast({
        title: "Success!",
        description: `"${data.title}" has been uploaded successfully and is available for online reading.`,
      });
      
      // Reset everything and close dialog
      resetDialog();
      setIsOpen(false);
      
      // Call the success callback to refresh the dashboard
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your magazine. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && !isUploading) {
      resetDialog();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Magazine</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Magazine</DialogTitle>
          <DialogDescription>
            Upload a PDF magazine to share with the Be Inspired community. Your magazine will be available for online reading.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* PDF File Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdf-upload">PDF Magazine *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {selectedFile ? (
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to select a PDF file or drag and drop
                    </p>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="cover-upload">Cover Image (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {selectedCoverImage ? (
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Image className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{selectedCoverImage.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedCoverImage.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeCoverImage}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to select an image file
                    </p>
                    <Input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter magazine title"
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description of your magazine"
                      disabled={isUploading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="w-full p-2 border border-input rounded-md bg-background"
                      disabled={isUploading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex items-center space-x-2 pt-4">
              <Button 
                type="submit" 
                disabled={isUploading || !selectedFile}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Magazine
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;