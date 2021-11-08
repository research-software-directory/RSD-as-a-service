import axios from 'axios'

const publishedSoftwareUrl = 'https://www.research-software.nl/api/software?isPublished=true'

export default {
  // xmlns as defined in the legacy app
  xmlNs: 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  hostname: 'https://www.research-software.nl/',
  gzip: true,
  trailingSlash: true,
  defaults: {
    changefreq: 'weekly',
    priority: 1,
    lastmod: new Date()
  },
  routes: async () => {
    // NOTE! fetch software list from legacy API
    // only published software is listed
    const resp = await axios.request({
      method: 'GET',
      url: publishedSoftwareUrl
    })
    if (resp.status !== 200) {
      console.error('Failed to fetch page from api')
      return []
    }
    // console.log('sofware...count...', resp.data.length)
    return resp.data.map((item, pos) => ({
      changefreq: 'weekly',
      // first 50 items more prio - just a test
      // more info https://www.v9digital.com/insights/sitemap-xml-why-changefreq-priority-are-important/
      priority: pos < 51 ? 1 : 0.8,
      lastmod: item.updatedAt,
      url: `software/${item.primaryKey.id}`
    }))
  },
  // exclude admin routes
  filter ({ routes }) {
    // console.log('sitemap.filter...routes...', routes)
    // console.log('sitemap.filter...options...', options)
    // filter out admin routes
    const filtered = routes.filter(route => route.name !== 'admin')
    // console.log('sitemap.filtered...', filtered)
    return filtered
  }
}
