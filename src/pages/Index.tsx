import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostCreator from "@/components/PostCreator";
import PostFeed from "@/components/PostFeed";
import Navigation from "@/components/Navigation";

const Index = () => {
  const { session, logout } = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            InstaClone
          </h1>
          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <PostCreator />
        <PostFeed />
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;