import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { session, logout } = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to InstaClone!</h1>
        <p className="text-xl text-gray-600 mb-8">
          You are logged in as {session.user.email}
        </p>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default Index;