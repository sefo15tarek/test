import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showError } from "@/utils/toast";
import { Home, Grid3X3, Bookmark, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  updated_at: string;
}

const Profile = () => {
  const { session, logout } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      showError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-2xl mx-auto">
        {/* Profile Info */}
        <div className="bg-white p-6">
          <div className="flex items-center mb-6">
            <Avatar className="w-20 h-20 mr-6">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-2xl">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h2 className="text-xl font-light mb-1">
                {session.user.email?.split('@')[0] || "username"}
              </h2>
              <p className="text-lg font-semibold mb-1">
                {profile?.full_name || "User"}
              </p>
              <p className="text-gray-500 text-sm">
                {session.user.email}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <div className="text-center">
              <p className="font-semibold">{posts.length}</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">1.2K</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">356</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Edit Profile
            </Button>
            <Button 
              onClick={logout} 
              variant="outline"
              className="border-gray-300"
            >
              Logout
            </Button>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="bg-white mt-2">
          <div className="flex border-t border-gray-200">
            <button className="flex-1 py-3 flex flex-col items-center text-sm font-semibold">
              <Grid3X3 className="h-4 w-4 mb-1" />
              POSTS
            </button>
            <button className="flex-1 py-3 flex flex-col items-center text-sm text-gray-500">
              <Bookmark className="h-4 w-4 mb-1" />
              SAVED
            </button>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 p-1">
              {posts.map((post) => (
                <div key={post.id} className="aspect-square">
                  <img 
                    src={post.image_url} 
                    alt={post.caption} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                <Grid3X3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No Posts Yet</h3>
              <p className="text-gray-500 text-sm">Share your first photo</p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;