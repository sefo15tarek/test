import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PostCard from "@/components/PostCard";
import { showError } from "@/utils/toast";

interface Post {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to new posts
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          // Add new post to the top of the feed
          const newPost = payload.new as Post;
          setPosts((prev) => [newPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          user_id, 
          caption, 
          image_url, 
          created_at,
          profiles (full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;