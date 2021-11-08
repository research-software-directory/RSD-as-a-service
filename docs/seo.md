# SEO setup nuxt

## Sitemap

Use [nuxt sitemap module](https://sitemap.nuxtjs.org/usage/sitemap-options) to generate sitemap.xml file.

More information about sitemap.xml file based on [Google documentation](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap)

```bash
# install module
yarn add @nuxtjs/sitemap
```

```js
// nuxt.config.js
modules: [
  // include sitemap module
  "@nuxtjs/sitemap",
],
```

```js
// add sitemap definitions object
sitemap: {
  // xmlns as defined in the legacy app
  xmlNs:'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  hostname: 'https://www.research-software.nl/',
  gzip: true,
  // trailingSlash: true,
  defaults: {
    changefreq: 'weekly',
    // priority: 1,
    lastmod: new Date()
  },
  // exclude
  filter ({ routes, options }) {
    console.log('sitemap.filter...routes...', routes)
    console.log('sitemap.filter...options...', options)
    // filter out admin routes
    return routes.filter(route => route.name !== 'admin')
  },
  routes: async()=>{
    // add dynamic routes to sitemap.xml
    return [1,2,3,4,5,6,7].map(item=>`software/${item}`)
  }
  // exclude: [
  //   '/admin/**'
  // ]
},
```

## Robots

For robots crawling definitions we can use static file. The [info can be found here](https://developers.google.com/search/docs/advanced/robots/create-robots-txt).

Nuxt has also dynamic options if needed, called [nuxtjs/robots](https://github.com/nuxt-community/robots-module)

## Page specific meta tags

I used software specific page where custom meta tags should be different for each software page.
All these tags can be added using the Vue meta Head tag of the page.

### OG meta

I created function for creating og meta tags at /utils/metaTags.ts

### Twitter meta

I created function for creating og meta tags at /utils/metaTags.ts

### Citation meta

I created function for creating og meta tags at /utils/metaTags.ts

### JSON LD

I created function for creating og meta tags at /utils/jsonLD.ts
