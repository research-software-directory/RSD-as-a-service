
import {PageTitleSticky} from '../layout/PageTitle'
import Breadcrumbs, {SlugInfo} from './Breadcrumbs'

import Searchbox from '../../components/search/Searchbox'

function createSegments(slug: string[]) {
  const segments:SlugInfo[] = [{
    label: 'organisations',
    path:'/organisation'
  }]
  let path='/organisation'
  slug.forEach((item, pos) => {
    if (pos === slug.length - 1) {
      // last segment is current page
      // so we do not place link/path
      segments.push({
        label: item,
        path: null
      })
    } else {
      path += `/${item}`
      segments.push({
        label: item,
        path
      })
    }
  })
  return segments
}

export default function OrganisationTitle({title, slug}:
  { title: string, slug: string[]}) {

  return (
    <PageTitleSticky>
      <section className="flex-1 flex items-center">
        <div className="flex-1">
          <h1 className="flex-1 w-full md:mt-4">{title}</h1>
          <div className='w-full'>
            <Breadcrumbs
              segments={createSegments(slug)}
            />
          </div>
        </div>
        <div>
          <Searchbox />
        </div>
      </section>
    </PageTitleSticky>
  )
}
