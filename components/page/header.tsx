import BackButton from '@/components/back-button';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui';
export function PageHeader({
  title,
  message,
  featured,
  tags,
  children,
}: {
  title: string;
  message?: string;
  featured?: boolean;
  tags?: string[];
  children?: ReactNode;
}) {
  return (
    <header className="container mx-auto flex items-center justify-between p-8">
      {/* campaigns[slug] ^px-4 py-8 */}
      {/* campaigns[slug] <div className="space-y-4 pb-2> */}
      <div className="flex items-center gap-4">
        {/* campaigns[slug] <div className="flex items-center gap-2 py-1"> */}
        <BackButton />
        {featured && (
          <Badge variant="secondary" className="px-3 py-1">
            Featured
          </Badge>
        )}
        {tags?.map((tag) => (
          <span key={tag} className="text-sm text-gray-500">
            {tag}
          </span>
        ))}
        <div>
          {typeof message === 'string' && (
            <div className="text-sm text-muted-foreground">{message}</div>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
          {children ? (
            <div className="flex items-center py-2">{children}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
