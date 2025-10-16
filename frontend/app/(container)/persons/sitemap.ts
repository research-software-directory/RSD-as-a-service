
import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getPublicProfilesForSitemap} from '~/components/seo/apiSitemap'

/**
 * Persons/Public profile related sitemap.xml
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
  if (modules.includes('persons')===false){
    return []
  }
  // get persons list (max. 50K)
  const persons = await getPublicProfilesForSitemap()

  // return array of persons for sitemap
  return persons.map(item=>{
    return {
      url:`${domain}/persons/${item.slug}`,
      lastModified: item.updated_at
    }
  })
}
