
import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getNewsForSitemap} from '~/components/seo/apiSitemap'

/**
 * News related sitemap.xml
 * NOTE! This sitemap need to be referred in robots.txt (robots.ts)
 * @returns sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // get domain and active rsd modules
  const [domain, modules]= await Promise.all([
    getDomainFromHeader(),
    getActiveModuleNames()
  ])

  // if module is not enabled we return empty sitemap.xml
  if (modules.includes('news')===false){
    return []
  }
  // get news list (max. 50K)
  const news = await getNewsForSitemap()

  // return array of news for sitemap
  return news.map(item=>{
    return {
      url:`${domain}/news/${item.slug}`,
      lastModified: item.updated_at
    }
  })
}
