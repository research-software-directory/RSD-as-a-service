
import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getOrganisationsForSitemap} from '~/components/seo/apiSitemap'

/**
 * Organisations related sitemap.xml
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
  if (modules.includes('organisations')===false){
    return []
  }
  // get organisations list (max. 50K)
  const organisations = await getOrganisationsForSitemap()

  // return array of organisations for sitemap
  return organisations.map(item=>{
    return {
      url:`${domain}/organisations/${item.slug}`,
      lastModified: item.updated_at
    }
  })
}
