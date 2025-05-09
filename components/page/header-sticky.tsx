import { PageHeader } from './header';

export function PageHeaderSticky({
  message,
  title,
}: {
  message?: string;
  title: string;
}) {
  return (
    <div className="sticky top-0 z-10">
      <PageHeader message={message} title={title} />
    </div>
  );
}
