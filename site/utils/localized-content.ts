import {
  CollectionEntry,
  DataEntryMap,
  getCollection,
  getEntry,
} from 'astro:content';

import { defaultLocale } from '~/locales.config';

export async function getLocalizedBlogCollection(
  locale: string,
): Promise<CollectionEntry<'blog-en'>[]> {
  // @ts-expect-error
  return getCollection(`blog-${locale}`) as Promise<
    CollectionEntry<'blog-en'>[]
  >;
}

export async function getLocalizedEntry<
  C extends keyof DataEntryMap,
  E extends keyof DataEntryMap[C],
>(
  collection: C,
  locale: E,
  defaultId = defaultLocale,
): Promise<DataEntryMap[C][E] | undefined> {
  const entry = await getEntry<
    keyof DataEntryMap,
    keyof DataEntryMap[keyof DataEntryMap]
  >(collection, locale as string);

  if (entry) {
    return entry as DataEntryMap[C][E];
  }

  return getEntry(collection, defaultId) as Promise<
    DataEntryMap[C][E] | undefined
  >;
}
