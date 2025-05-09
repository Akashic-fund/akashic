import { type Comment } from '@/types/campaign';
import {
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui';
export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage
              src={
                comment?.userAddress
                  ? `https://avatar.vercel.sh/${comment.userAddress}`
                  : 'default_avatar_url'
              }
            />
            <AvatarFallback>
              {comment?.userAddress
                ? comment.userAddress.slice(0, 2).toUpperCase()
                : 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {`${comment?.userAddress ? `${comment.userAddress.slice(0, 6)}...${comment.userAddress.slice(-6)}` : 'Anonymous'}`}
              </h4>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{comment.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
