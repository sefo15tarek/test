import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";
import { Camera, Smile, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          {/* User Avatar and Textarea */}
          <div className="flex mb-4">
            <Avatar className="mr-3">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                {session?.user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1 resize-none border-0 p-0 text-base focus:ring-0"
              rows={2}
            />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full object-cover max-h-96"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <label className="cursor-pointer flex items-center text-gray-500 hover:text-gray-700">
                <Camera className="h-5 w-5 mr-1" />
                Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <button 
                type="button" 
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <Smile className="h-5 w-5 mr-1" />
                Feeling
              </button>
              <button 
                type="button" 
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <MapPin className="h-5 w-5 mr-1" />
                Location
              </button>
            </div>
            
            <Button 
              type="submit" 
              disabled={isUploading || !image}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isUploading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostCreator;