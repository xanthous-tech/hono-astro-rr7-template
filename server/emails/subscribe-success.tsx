import { z } from 'zod';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
  render,
} from '@react-email/components';

import { Email } from '@/types/email';
import { getFixedT } from '@site/utils/i18next';

interface SubscribeSuccessEmailProps {
  previewText: string;
  title: string;
  body: string;
  footer: string;
}

function SubscribeSucessEmail({
  previewText,
  title,
  body,
  footer,
}: SubscribeSuccessEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="rounded my-0 mx-auto p-[20px] w-[560px]">
            <Text className="text-[#484848] text-[24px] font-normal my-[30px] mx-0">
              {title}
            </Text>

            <Text className="text-[#3c4149] text-[15px] leading-[24px]">
              {body}
            </Text>

            <Hr className="my-[26px] mx-0 w-full" />

            <Text className="text-[#ababab] text-[12px] leading-[24px]">
              {footer}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default function SubscribeSuccessEmailPreview() {
  return (
    <SubscribeSucessEmail
      title="Thank you for subscribing to The Product!"
      previewText="You're all set to start working."
      body="We are glad to have you on board. We don't send out a lot of emails, but if there is anything you need, please don't hesitate to reach out to us (replying to this email works very well, there is also a chat bubble on the bottom-right side of the website, that works too)."
      footer="The Product"
    />
  );
}

const subscribeSuccessEmailSchema = z.object({
  locale: z.string().default('en'),
});

type SubscribeSuccessEmailArgs = z.infer<typeof subscribeSuccessEmailSchema>;

export async function renderSubscribeSuccessEmail(
  args: SubscribeSuccessEmailArgs,
): Promise<Email> {
  const { locale } = subscribeSuccessEmailSchema.parse(args);

  const t = await getFixedT(locale);

  const subject = t('emails.subscribe_success.subject');
  const html = await render(
    <SubscribeSucessEmail
      title={t('emails.subscribe_success.subject')}
      previewText={t('emails.subscribe_success.preview_text')}
      body={t('emails.subscribe_success.body')}
      footer={t('emails.footer')}
    />,
  );

  return {
    subject,
    html,
  };
}
