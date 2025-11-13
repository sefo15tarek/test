import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";

const PostCreator = () => {
  const { session } = useSession();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user || !image) {
      showError("Please select an image");
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload image first
      const imageUrl = await uploadImage(image);
      
      // Create post record
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: session.user.id,
          caption,
          image_url: imageUrl
        });

      if (insertError) throw insertError;

      showSuccess("Post created successfully!");
      setCaption("");
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error creating post:", error);
      showError("Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mb-4"
            />
            
            {previewUrl && (
              <div className="mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-sm">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              
              <Button 
                type="submit" 
                disabled={isUploading || !image}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isUploading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostCreator;