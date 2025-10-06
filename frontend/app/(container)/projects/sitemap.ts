
import type {MetadataRoute} from 'next'
import {getDomainFromHeader} from '~/utils/getDomainFromHeader'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getProjectsForSitemap} from '~/components/seo/apiSitemap'

/**
 * Projects related sitemap.xml
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
  if (modules.includes('projects')===false){
    return []
  }
  // get projects list (max. 50K)
  const projects = await getProjectsForSitemap()

  // return array of projects for sitemap
  return projects.map(item=>{
    return {
      url:`${domain}/projects/${item.slug}`,
      lastModified: item.updated_at
    }
  })
}
