'use client';

import { useCallback, useEffect, useState, type HTMLAttributes } from 'react';
import { useFetcher } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '~/lib/utils';
import { AppleIcon } from '~/components/icons/apple';
import { GitHubIcon } from '~/components/icons/github';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

interface MagicLinkFormProps extends HTMLAttributes<HTMLDivElement> {
  locale: string;
}

const userAuthSchema = z.object({
  email: z.string().email('please enter a valid email address'),
});
const resolver = zodResolver(userAuthSchema);
type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({
  className,
  locale,
  ...props
}: MagicLinkFormProps) {
  const { t } = useTranslation('translation', { lng: locale });
  const form = useForm<FormData>({
    resolver,
    defaultValues: {
      email: '',
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetcher = useFetcher<{ emailTo?: string }>();

  useEffect(() => {
    if (fetcher.data?.emailTo) {
      toast(t('magic_link_sent'));
    }
  }, [fetcher.data]);

  const submitForm = useCallback(
    async (values: FormData) => {
      setIsLoading(true);
      await fetcher.submit(values, { method: 'POST' });
      setIsLoading(false);
    },
    [form],
  );

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                name="email"
                disabled={fetcher.state !== 'idle'}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t('signin_with_email')}
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('or')}
          </span>
        </div>
      </div>
      <a
        href="/api/auth/github/login"
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        <GitHubIcon className="mr-2 h-4 w-4" />
        {t('signin_with_github')}
      </a>
      <a
        href="/api/auth/apple/login"
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        <AppleIcon className="mr-2 h-4 w-4" />
        {t('signin_with_apple')}
      </a>
    </div>
  );
}
