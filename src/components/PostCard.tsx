import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <Card className="mb-6">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center p-4">
          <Avatar>
            {post.profiles?.avatar_url ? (
              <img 
                src={post.profiles.avatar_url} 
                alt={post.profiles.full_name || "User"} 
              />
            ) : (
              <AvatarFallback>
                {post.profiles?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-3">
            <p className="font-semibold text-sm">
              {post.profiles?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>

        {/* Post Image */}
        <div className="w-full">
          <img 
            src={post.image_url} 
            alt={post.caption} 
            className="w-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>

        {/* Post Caption */}
        <div className="p-4">
          <p className="text-sm">
            <span className="font-semibold mr-2">
              {post.profiles?.full_name || "User"}
            </span>
            {post.caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;