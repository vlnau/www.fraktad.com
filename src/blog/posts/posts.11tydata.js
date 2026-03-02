export default {
  layout: 'layouts/blog-post.html',
  lang: 'pl',
  bodyClass: 'min-h-screen bg-brand-white text-brand-ink',
  permalink: ({ page }) => `/blog/${page.fileSlug}/`,
};
