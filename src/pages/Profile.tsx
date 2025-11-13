import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showError } from "@/utils/toast";
import { Home } from "lucide-react";
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

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
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

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <h2 className="text-xl font-bold mb-1">
                {profile?.full_name || "User"}
              </h2>
              
              <p className="text-gray-500 mb-4">
                {session.user.email}
              </p>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-12 text-gray-500">
          <p>Posts will appear here</p>
        </div>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;