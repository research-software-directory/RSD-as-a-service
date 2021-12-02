import {NextApiResponse} from 'next'
import {generateSiteMap} from '../utils/generateSitemap'

export async function getServerSideProps({res}:{res:NextApiResponse}) {
  // Dynamicaly generate XML sitemap from the database
  const sitemap = await generateSiteMap()
  // return response from server
  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  // we end response here
  // we do not go next frontend component
  res.end()
  // actually not relevant due to res.end()
  return {
    props: {}
  }
}

function SiteMap() {
  // getServerSideProps creates and returns xml
  // This function represents dummy next page that is not shown
}

export default SiteMap