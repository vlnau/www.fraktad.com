import Image from '@11ty/eleventy-img';

const DEFAULT_WIDTHS = [480, 768, 1200, 1600];
const FONT_SUBSETS = [
  'cyrillic-ext',
  'cyrillic',
  'greek',
  'vietnamese',
  'latin-ext',
  'latin',
];
const FONT_FORMATS = ['woff2', 'woff'];
const MANROPE_WEIGHTS = [400, 500, 600, 700, 800];
const IBM_PLEX_SANS_WEIGHTS = [500, 600, 700];

function parseWidths(widths) {
  if (Array.isArray(widths)) {
    return widths;
  }

  if (typeof widths === 'string') {
    const parsed = widths
      .split(',')
      .map((entry) => Number.parseInt(entry.trim(), 10))
      .filter((entry) => Number.isFinite(entry) && entry > 0);

    if (parsed.length > 0) {
      return parsed;
    }
  }

  return DEFAULT_WIDTHS;
}

function normalizeImageSource(src) {
  if (/^https?:\/\//.test(src)) {
    return src;
  }

  const cleaned = src.replace(/\\/g, '/').replace(/^\.?\//, '');
  return cleaned.startsWith('src/') ? cleaned : `src/${cleaned}`;
}

function addFontsourceCopies(
  eleventyConfig,
  packageName,
  outputDir,
  fontFilePrefix,
  weights,
) {
  for (const weight of weights) {
    eleventyConfig.addPassthroughCopy({
      [`node_modules/@fontsource/${packageName}/${weight}.css`]: `assets/vendor/fonts/${outputDir}/${weight}.css`,
    });

    for (const subset of FONT_SUBSETS) {
      for (const format of FONT_FORMATS) {
        eleventyConfig.addPassthroughCopy({
          [`node_modules/@fontsource/${packageName}/files/${fontFilePrefix}-${subset}-${weight}-normal.${format}`]: `assets/vendor/fonts/${outputDir}/files/${fontFilePrefix}-${subset}-${weight}-normal.${format}`,
        });
      }
    }
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addCollection('blogPosts', (collectionApi) =>
    collectionApi
      .getFilteredByGlob('src/blog/posts/*.md')
      .filter((item) => item.data.draft !== true)
      .sort((a, b) => {
        const aDate = new Date(a.data.date || a.date).getTime();
        const bDate = new Date(b.data.date || b.date).getTime();
        return bDate - aDate;
      }),
  );

  eleventyConfig.addNunjucksAsyncShortcode(
    'image',
    async (
      src,
      alt = '',
      className = '',
      sizes = '100vw',
      widths = '',
      loading = 'lazy',
      fetchpriority = '',
      extraAttributesJson = '',
    ) => {
      const imageSource = normalizeImageSource(src);
      const metadata = await Image(imageSource, {
        widths: parseWidths(widths),
        formats: ['avif', 'webp', 'auto'],
        outputDir: '_site/assets/images/optimized',
        urlPath: '/assets/images/optimized/',
        sharpWebpOptions: { quality: 70 },
        sharpAvifOptions: { quality: 45 },
        sharpJpegOptions: { quality: 75, mozjpeg: true },
        sharpPngOptions: { compressionLevel: 9, quality: 80 },
        cacheOptions: {
          duration: '30d',
          directory: '.cache/eleventy-img',
          removeUrlQueryParams: false,
        },
      });

      let extraAttributes = {};
      if (extraAttributesJson) {
        extraAttributes = JSON.parse(extraAttributesJson);
      }

      const attributes = {
        ...extraAttributes,
        alt,
        class: className || undefined,
        sizes,
        loading,
        decoding: 'async',
      };

      if (fetchpriority) {
        attributes.fetchpriority = fetchpriority;
      }

      return Image.generateHTML(metadata, attributes);
    },
  );

  eleventyConfig.addPassthroughCopy({
    'src/assets/css/styles.css': 'assets/css/styles.css',
  });
  eleventyConfig.addPassthroughCopy({ 'src/assets/js': 'assets/js' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': 'assets/images' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/swiper/swiper-bundle.min.css':
      'assets/vendor/swiper/swiper-bundle.min.css',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css':
      'assets/vendor/fontawesome/css/all.min.css',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/@fortawesome/fontawesome-free/webfonts':
      'assets/vendor/fontawesome/webfonts',
  });
  addFontsourceCopies(
    eleventyConfig,
    'manrope',
    'manrope',
    'manrope',
    MANROPE_WEIGHTS,
  );
  addFontsourceCopies(
    eleventyConfig,
    'ibm-plex-sans',
    'ibm-plex-sans',
    'ibm-plex-sans',
    IBM_PLEX_SANS_WEIGHTS,
  );

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
