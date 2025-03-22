import { Menu } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { cn } from '~/lib/utils';

export interface MobileNavProps {
  title: string;
  items: { key: string; title: string; url: string; active?: boolean }[];
}

export function MobileNav({ title, items }: MobileNavProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <nav className="flex flex-col space-y-2">
          <span className="font-bold inline-block mb-2">{title}</span>
          {items.map((item) => (
            <a
              key={item.key}
              href={item.url}
              className={cn(
                'text-sm',
                'transition-colors',
                'hover:text-stone-500',
                item.active ? 'text-stone-400' : 'text-stone-700',
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </PopoverContent>
    </Popover>
  );
}
