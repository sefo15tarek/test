import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostCreator from "@/components/PostCreator";
import PostFeed from "@/components/PostFeed";
import Navigation from "@/components/Navigation";
import { Camera, Heart, MessageCircle, Send } from "lucide-react";

const Index = () => {
  const { session, logout } = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      {/* Header with gradient */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            InstaClone
          </h1>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={logout} 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Stories Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex flex-col items-center flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                    <div className="bg-white p-0.5 rounded-full">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
                    </div>
                  </div>
                  {item === 1 && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                      <Camera className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs mt-1 text-gray-600 truncate w-16 text-center">
                  {item === 1 ? "Your Story" : `User ${item}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Post Creator */}
        <PostCreator />
        
        {/* Feed Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Posts</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Heart className="h-4 w-4 mr-1" />
              Popular
            </Button>
          </div>
        </div>
        
        {/* Post Feed */}
        <PostFeed />
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;