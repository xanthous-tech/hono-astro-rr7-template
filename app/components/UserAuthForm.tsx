import { useCallback, useState, type HTMLAttributes } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useSignIn } from '~/hooks/api';
import { apiUrl } from '~/lib/api';

import { cn } from '~/lib/utils';
import { GoogleIcon } from '~/components/icons/google';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

interface MagicLinkFormProps extends HTMLAttributes<HTMLDivElement> {}

const userAuthSchema = z.object({
  email: z.string().email('please enter a valid email address'),
});
const resolver = zodResolver(userAuthSchema);
type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: MagicLinkFormProps) {
  const { t, i18n } = useTranslation();
  const signIn = useSignIn();

  const form = useForm<FormData>({
    resolver,
    defaultValues: {
      email: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitForm = useCallback(
    async (values: FormData) => {
      setIsLoading(true);
      const result = await signIn.mutateAsync({
        emailTo: values.email,
        locale: i18n.language,
      });
      console.log(result);
      toast(t('app.signin.magic_link_sent'));
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
                disabled={isLoading}
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
              {t('app.signin.signin_with_email')}
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
            {t('app.signin.or')}
          </span>
        </div>
      </div>
      <a
        href={`${apiUrl}/api/auth/google/login`}
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        {t('app.signin.signin_with_google')}
      </a>
    </div>
  );
}
