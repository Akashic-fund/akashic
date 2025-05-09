import { CommentItem } from './item';
import { type Comment } from '@/types/campaign';
export function CommentList({ comments }: { comments?: Comment[] }) {
  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
