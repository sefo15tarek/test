import { Link, useLocation } from "react-router-dom";
import { Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:hidden">
      <div className="flex justify-around items-center py-2">
        <Button 
          variant={location.pathname === "/" ? "default" : "ghost"} 
          size="icon"
          asChild
        >
          <Link to="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
        
        <Button 
          variant={location.pathname === "/profile" ? "default" : "ghost"} 
          size="icon"
          asChild
        >
          <Link to="/profile">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;