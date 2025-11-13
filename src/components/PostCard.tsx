import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

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

const PostCard = ({ post }: { post: Post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center p-3">
          <Avatar>
            {post.profiles?.avatar_url ? (
              <img 
                src={post.profiles.avatar_url} 
                alt={post.profiles.full_name || "User"} 
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {post.profiles?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="font-semibold text-sm">
              {post.profiles?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(post.created_at)}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <span className="text-lg font-bold text-gray-800">...</span>
          </Button>
        </div>

        {/* Post Image */}
        <div className="w-full bg-gray-100">
          <img 
            src={post.image_url} 
            alt={post.caption} 
            className="w-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>

        {/* Post Actions */}
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                <Heart className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors" />
              </Button>
              <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                <MessageCircle className="h-6 w-6 text-gray-700 hover:text-blue-500 transition-colors" />
              </Button>
              <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                <Send className="h-6 w-6 text-gray-700 hover:text-green-500 transition-colors" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <Bookmark className="h-6 w-6 text-gray-700 hover:text-yellow-500 transition-colors" />
            </Button>
          </div>

          {/* Likes Count */}
          <p className="text-sm font-semibold mb-1">1,234 likes</p>

          {/* Post Caption */}
          <p className="text-sm">
            <span className="font-semibold mr-2">
              {post.profiles?.full_name || "User"}
            </span>
            {post.caption}
          </p>

          {/* View Comments */}
          <button className="text-sm text-gray-500 mt-1">
            View all 42 comments
          </button>

          {/* Add Comment */}
          <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 text-sm border-0 focus:ring-0 p-0"
            />
            <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
              Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;