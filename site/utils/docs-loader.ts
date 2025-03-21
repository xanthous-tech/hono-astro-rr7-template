import { glob, type Loader, type LoaderContext } from 'astro/loaders';

const docsExtensions = [
  'markdown',
  'mdown',
  'mkdn',
  'mkd',
  'mdwn',
  'md',
  'mdx',
];

export function docsLoader(): Loader {
  // if (
  //   context.config.integrations.find(({ name }) => name === '@astrojs/markdoc')
  // ) {
  //   extensions.push('mdoc');
  // }

  return {
    name: 'starlight-docs-loader',
    load: (context: LoaderContext) => {
      const extensions = docsExtensions;

      if (
        context.config.integrations.find(
          ({ name }) => name === '@astrojs/markdoc',
        )
      ) {
        // https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/content-entry-type.ts#L28
        extensions.push('mdoc');
      }

      return glob({
        base: './content/docs',
        pattern: `**/[^_]*.{${extensions.join(',')}}`,
      }).load(context);
    },
  };
}
