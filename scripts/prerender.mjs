// Runs after `vite build` and the SSR build. For every route it writes a real HTML file into dist/
// with the page content, its own <title>/meta tags, canonical URL and JSON-LD, then generates sitemap.xml.
// Crawlers and AI tools that do not run JavaScript get the full page; browsers hydrate it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const dist = path.resolve('dist')
const { render } = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href)
const { servicePages, SITE } = await import(pathToFileURL(path.resolve('src/content/servicePages.js')).href)
const { galleryPage, galleryPhotos } = await import(pathToFileURL(path.resolve('src/content/gallery.js')).href)

const template = readFileSync(path.join(dist, 'index.html'), 'utf8')

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`
const setTag = (html, re, replacement) => {
  if (!re.test(html)) throw new Error(`prerender: tag not found in template: ${re}`)
  return html.replace(re, () => replacement)
}
const withSlash = (p) => (p === '/' ? '/' : p.replace(/\/?$/, '/'))

function injectRoot(html, body) {
  return setTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`)
}

// Per-page <title>, description, canonical and social tags. The homepage keeps the template's own.
function withPageHead(page, url) {
  let html = template
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${attr(page.title)}</title>`)
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${attr(page.description)}" />`)
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${attr(page.title)}" />`)
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${attr(page.description)}" />`)
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${attr(page.title)}" />`)
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${attr(page.description)}" />`)
  // The homepage <noscript> summary is not needed: this page's content is already in the HTML.
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/, '')
}

const breadcrumbLd = (url, names) =>
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
      ...names.map((name, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name,
        ...(i === names.length - 1 ? { item: url } : {}),
      })),
    ],
  })

function servicePageHtml(page) {
  const url = SITE + withSlash(page.path)
  const html = withPageHead(page, url)

  const extra = [
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.serviceName,
      serviceType: page.serviceName,
      url,
      provider: { '@id': `${SITE}/#business` },
      areaServed: { '@type': 'City', name: page.city, containedInPlace: { '@type': 'State', name: 'Oregon' } },
      description: page.description,
    }),
    breadcrumbLd(url, page.breadcrumb),
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    }),
  ].join('\n    ')
  return injectRoot(setTag(html, /<\/head>/, `    ${extra}\n  </head>`), render(page.path))
}

function galleryPageHtml() {
  const url = SITE + withSlash(galleryPage.path)
  const extra = [
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: galleryPage.h1,
      url,
      description: galleryPage.description,
      publisher: { '@id': `${SITE}/#business` },
      image: galleryPhotos.map((p) => ({
        '@type': 'ImageObject',
        contentUrl: `${SITE}/gallery/${p.id}-lg.webp`,
        thumbnailUrl: `${SITE}/gallery/${p.id}-sm.webp`,
        description: p.alt,
        width: p.lw,
        height: p.lh,
      })),
    }),
    breadcrumbLd(url, galleryPage.breadcrumb),
  ].join('\n    ')
  return injectRoot(setTag(withPageHead(galleryPage, url), /<\/head>/, `    ${extra}\n  </head>`), render(galleryPage.path))
}

function write(routePath, html) {
  const file = routePath === '/' ? path.join(dist, 'index.html') : path.join(dist, routePath, 'index.html')
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, html)
  console.log('prerendered', routePath === '/' ? '/' : withSlash(routePath))
}

// Homepage: keeps its own head tags; only the body is prerendered. The <noscript> fact summary in
// index.html is only a fallback for the unrendered template, so drop it from the prerendered output.
write('/', injectRoot(template.replace(/<noscript>[\s\S]*?<\/noscript>/, ''), render('/')))
for (const page of servicePages) write(page.path, servicePageHtml(page))
write(galleryPage.path, galleryPageHtml())

// Payment pages render in the browser only (they read query params and load Stripe). Give them an
// empty root so main.jsx renders instead of hydrating the homepage markup, and keep them out of search.
for (const [p, title] of [['/pay', 'Make a Payment | Northwest Siding'], ['/pos', 'Take a Payment | Northwest Siding']]) {
  const html = withPageHead({ title, description: 'Secure payment for Northwest Siding customers.' }, SITE + withSlash(p))
  write(p, setTag(html, /<\/head>/, '    <meta name="robots" content="noindex, nofollow" />\n  </head>'))
}

const today = new Date().toISOString().slice(0, 10)
const urls = ['/', ...servicePages.map((p) => withSlash(p.path)), withSlash(galleryPage.path)]
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map((u) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
    .join('\n') +
  '\n</urlset>\n'
writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
console.log(`sitemap.xml: ${urls.length} URLs`)
