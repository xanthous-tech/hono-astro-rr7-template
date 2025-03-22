import { icons } from 'lucide-react';
import { FC } from 'react';

export interface LucideIconProps {
  name: string;
  className?: string;
}

export function LucideIcon({ name, className }: LucideIconProps) {
  const Icon = (icons as any)[name] as FC<{ className?: string }>;

  return <Icon className={className} />;
}
