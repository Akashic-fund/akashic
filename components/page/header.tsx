import { useMemo } from 'react';
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
  title?: string;
  message?: string;
  featured?: boolean;
  tags?: string[];
  children?: ReactNode;
}) {
  const headLine = useMemo(() => {
    const items = [];
    if (typeof message === 'string') {
      items.push(
        <div key="message" className="text-sm text-muted-foreground">
          {message}
        </div>,
      );
    }
    if (typeof title === 'string') {
      items.push(
        <h1 key="title" className="text-lg font-semibold sm:text-4xl">
          {title}
        </h1>,
      );
    }
    return items;
  }, [message, title]);
  const navLine = useMemo(() => {
    const items = [];
    if (featured) {
      items.push(
        <Badge key="featured" variant="secondary" className="px-3 py-1">
          Featured
        </Badge>,
      );
    }
    if (Array.isArray(tags) && tags.length) {
      items.push(
        <div key="tags" className="flex flex-wrap">
          {tags?.map((tag) => (
            <span key={tag} className="pr-1 text-sm text-gray-500">
              {tag}
            </span>
          ))}
        </div>,
      );
    }
    if (items.length === 0) {
      items.push(headLine);
    }
    return items;
  }, [featured, tags, headLine]);
  return (
    <header className="mt-4 inline items-center justify-between p-8">
      {/* campaigns[slug] ^px-4 py-8 */}
      {/* campaigns[slug] <div className="space-y-4 pb-2> */}
      <div className="flex min-h-[75px] flex-wrap items-center gap-4 md:min-h-0">
        {/* campaigns[slug] <div className="flex items-center gap-2 py-1"> */}
        <div className="mb-8 flex flex-row items-center gap-2 py-1 md:mb-2 md:ml-4">
          <BackButton />
          {navLine}
        </div>
      </div>
      <div>
        <div className="ml-2 flex flex-col md:ml-4 md:content-start">
          {navLine[0] !== headLine && headLine}
          {children ? (
            <div className="flex items-center py-2">{children}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
