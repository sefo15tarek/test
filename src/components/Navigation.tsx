import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:hidden">
      <div className="flex justify-around items-center py-3">
        <Button 
          variant={location.pathname === "/" ? "default" : "ghost"} 
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link to="/">
            <Home className="h-6 w-6" />
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
        >
          <Search className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <PlusSquare className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
        >
          <Heart className="h-6 w-6" />
        </Button>
        
        <Button 
          variant={location.pathname === "/profile" ? "default" : "ghost"} 
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link to="/profile">
            <User className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;