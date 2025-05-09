import { useState, useCallback } from 'react';
import { categories } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export function HomeCategorySelect({
  onSelected,
}: {
  onSelected: (category: string | null) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const onSelect = useCallback(
    (categoryId: string | null) => {
      setSelectedCategory(categoryId ?? null);
      onSelected(categoryId ?? null);
    },
    [onSelected, setSelectedCategory],
  );
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      <Button
        key="all"
        variant="outline"
        className={cn(
          'flex items-center gap-2 rounded-full',
          !selectedCategory ? 'bg-purple-100 text-purple-600' : 'bg-white',
        )}
        onClick={() => onSelect(null)}
      >
        <div className="text-2xl">🌟</div>
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={cn(
            'flex items-center gap-2 rounded-full',
            selectedCategory === category.id
              ? 'bg-purple-100 text-purple-600'
              : 'bg-white',
          )}
          onClick={() => onSelect(category.id)}
        >
          <div className="text-2xl">{category.icon}</div>
          {category.name}
        </Button>
      ))}
    </div>
  );
}
