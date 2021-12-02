import {SoftwareItem} from "../types/SoftwareItem"
import {ProjectItem} from "../types/ProjectItem"

// sitemap information from google
// https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=en&visit_id=637738841236975025-2039495347&rd=1

// TODO! update these constants to represent actual values
const BASE_URL="https://www.research-software.nl"
const BASE_API_URL="https://www.research-software.nl/api"
const SOFTWARE_ENDPOINT="/software?isPublished=true"
const PROJECTS_ENDPOINT="/project?isPublished=true"

function getLastmodDate(updatedAt:string){
try{
  return `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>`
}catch(e){
  // on error return empty string = nothing
  return ''
}}

async function generateSoftwareSitemap(endpoint:string){
try{
  // console.log("generateSoftwareSitemap...", endpoint)
  const request = await fetch(endpoint)
  const software:SoftwareItem[] = await request.json()

  return software
    .map(({ slug, updatedAt }) => {
      return `
        <url>
            <loc>${`${BASE_URL}/software/${slug}`}</loc>
            <changefreq>weekly</changefreq>
            ${getLastmodDate(updatedAt)}
        </url>
      `
    })
    .join('')
}catch(e){
  return ""
}}

async function generateProjectSitemap(endpoint:string){
  try{
    // console.log("generateProjectSitemap...", endpoint)
    const request = await fetch(endpoint)
    const projects:ProjectItem[] = await request.json()

    return projects
      .map(({ primaryKey:{id}, updatedAt }) => {
        return `
          <url>
              <loc>${`${BASE_URL}/projects/${id}`}</loc>
              <changefreq>weekly</changefreq>
              ${getLastmodDate(updatedAt)}
          </url>
        `
      })
      .join('')
  }catch(e){
    return ""
  }}


export async function generateSiteMap() {
  // construct api endpoints
  const softwareEndpoint = `${BASE_API_URL}${SOFTWARE_ENDPOINT}`
  const projectEndpoint = `${BASE_API_URL}${PROJECTS_ENDPOINT}`

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}</loc>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>${BASE_URL}/about</loc>
        <changefreq>monthly</changefreq>
    </url>
    ${ await generateSoftwareSitemap(softwareEndpoint)}
    ${ await generateProjectSitemap(projectEndpoint)}
   </urlset>
 `
}