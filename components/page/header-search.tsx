import { useState, useCallback, type ChangeEvent, ReactNode } from 'react';
import { useAuth } from '@/contexts';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { Button, Input } from '@/components/ui';

export function PageHeaderSearch({
  placeholder,
  onSearchChanged,
  onCreate,
  createTitle,
  buttons,
}: {
  placeholder: string;
  onSearchChanged: (search: string) => void;
  onCreate?: () => void;
  createTitle?: string;
  buttons?: ReactNode;
}) {
  const { login, authenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const onSearchInputChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      onSearchChanged(event.target.value);
    },
    [setSearchTerm, onSearchChanged],
  );
  return (
    <header className="inline justify-between p-0 md:p-4">
      <div className="flex min-h-[100px] flex-wrap items-center pl-1 pt-[2px] md:ml-3 md:mr-8 md:min-h-0">
        <div className="flex flex-row items-center py-1 md:ml-4">
          <div className="relative">
            <Search
              className={cn(
                'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400',
              )}
            />
            <Input
              className="w-[calc(100vw-88px)] rounded-xl pl-10 md:max-w-sm"
              placeholder={placeholder}
              type="search"
              value={searchTerm}
              onChange={onSearchInputChanged}
            />
          </div>
        </div>
        <div className="grow" />
        <div className="flex flex-row items-center gap-4">
          <Button
            variant="outline"
            className="bg-purple-50 font-semibold text-purple-600 hover:bg-purple-100"
            onClick={login}
          >
            {authenticated ? 'Connected' : 'Connect Wallet'}
            <Image src="/wallet-icon.png" alt="wallet" width={14} height={14} />
          </Button>
          {typeof onCreate === 'function' &&
            typeof createTitle === 'string' && (
              <Button
                className="bg-emerald-400 font-semibold hover:bg-emerald-500"
                onClick={onCreate}
              >
                {createTitle}
              </Button>
            )}
          {buttons}
        </div>
      </div>
    </header>
  );
}
