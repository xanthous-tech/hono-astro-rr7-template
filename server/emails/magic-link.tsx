import { z } from 'zod';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  render,
} from '@react-email/components';

import { Email } from '@/types/email';
import { getFixedT } from '@site/utils/i18next';

interface MagicLinkEmailProps {
  previewText: string;
  title: string;
  link: string;
  buttonText: string;
  body: string;
  footer: string;
}

function MagicLinkEmail({
  previewText,
  title,
  link,
  buttonText,
  body,
  footer,
}: MagicLinkEmailProps) {
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

            <Section className="mt-[36px] mb-[28px]">
              <Button
                className="bg-black rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
                href={link}
              >
                {buttonText}
              </Button>
            </Section>

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

export default function MagicLinkEmailPreview() {
  return (
    <MagicLinkEmail
      title="Your login link for The Product"
      previewText="Log into The Product using your magic link"
      link="https://example.com"
      buttonText="Log into The Product"
      body="This magic link is only valid for the next 5 minutes."
      footer="The Product"
    />
  );
}

const magicLinkEmailSchema = z.object({
  link: z.string(),
  locale: z.string().default('en'),
});

type MagicLinkEmailArgs = z.infer<typeof magicLinkEmailSchema>;

export async function renderMagicLinkEmail(
  args: MagicLinkEmailArgs,
): Promise<Email> {
  const { locale, link } = magicLinkEmailSchema.parse(args);

  const t = await getFixedT(locale);

  const subject = t('emails.magic_link.subject');
  const html = await render(
    <MagicLinkEmail
      previewText={t('emails.magic_link.preview_text')}
      title={t('emails.magic_link.subject')}
      link={link}
      buttonText={t('emails.magic_link.button_text')}
      body={t('emails.magic_link.body')}
      footer={t('emails.footer')}
    />,
  );

  return {
    subject,
    html,
  };
}
