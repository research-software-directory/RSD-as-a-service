
import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getCommunitiesForSitemap} from '~/components/seo/apiSitemap'

/**
 * Communities related sitemap.xml
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
  if (modules.includes('communities')===false){
    return []
  }
  // get communities list (max. 50K)
  const communities = await getCommunitiesForSitemap()

  // return array of communities for sitemap
  return communities.map(item=>{
    return {
      url:`${domain}/communities/${item.slug}`,
      lastModified: item.updated_at
    }
  })
}
