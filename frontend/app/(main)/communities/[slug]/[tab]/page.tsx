import {notFound} from 'next/navigation'

import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettingsApp'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getCommunityBySlug} from '~/components/communities/apiCommunities'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import {CommunityRequestStatus, getSoftwareForCommunity} from '~/components/communities/software/apiCommunitySoftware'
import {
  comSoftwareCategoriesFilter,
  comSoftwareKeywordsFilter,
  comSoftwareLanguagesFilter,
  comSoftwareLicensesFilter
} from '~/components/communities/software/filters/apiCommunitySoftwareFilters'
import {TabKey} from '~/components/communities/tabs/CommunityTabItems'
import CommunitySoftware from '~/components/communities/software'
import CommunitySettingsContent from '~/components/communities/settings'

export default async function CommunityPages({
  params,
  searchParams
}:Readonly<{
  searchParams: Promise<{ [key: string]: string | undefined }>,
  params: Promise<{slug: string, tab:TabKey}>,
}>){

  const [{slug,tab},query,{token,rsd_page_rows}] = await Promise.all([
    params,
    searchParams,
    getUserSettings()
  ])

  const user = getUserFromToken(token ?? null)

  // find community by slug
  const {community,isMaintainer} = await getCommunityBySlug({
    slug: slug ?? '',
    token: token,
    user
  })
  // if community not found we return 404
  if (community === null){
    notFound()
  }
  // extract and decode query params
  const {search, keywords, prog_lang, licenses, categories, order, rows, page} = ssrSoftwareParams(query)

  // decide on software filter
  let software_status:CommunityRequestStatus = 'pending'
  if (tab==='rejected') software_status = 'rejected'
  if (tab==='software') software_status = 'approved'

  const rowsPerPage = rows ?? rsd_page_rows ?? 12

  // get all data
  const [
    software,
    keywordsList,
    languagesList,
    licensesList,
    categoryList
  ] = await Promise.all([
    getSoftwareForCommunity({
      community: community.id,
      software_status,
      searchFor: search,
      keywords,
      prog_lang,
      licenses,
      categories,
      order,
      rows: rowsPerPage,
      page: page ? page-1 : 0,
      isMaintainer,
      token
    }),
    comSoftwareKeywordsFilter({
      id: community.id,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    }),
    comSoftwareLanguagesFilter({
      id: community.id,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    }),
    comSoftwareLicensesFilter({
      id: community.id,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    }),
    comSoftwareCategoriesFilter({
      id: community.id,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    })
  ])

  const numPages = Math.ceil(software.count / rowsPerPage)

  // console.group('CommunitySoftware')
  // console.log('slug...', slug)
  // console.log('tab...', tab)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('community...', community)
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('categories...', categories)
  // console.log('order...', order)
  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('numPages...', numPages)
  // console.log('software...', software)
  // console.groupEnd()

  switch(tab){
    // same components for all three software "types"
    case 'software':
    case 'requests':
    case 'rejected':
      return (
        <CommunitySoftware
          software = {software.data}
          count = {software.count}
          page={page ?? 1}
          pages={numPages}
          keywordsList={keywordsList}
          languagesList={languagesList}
          licensesList={licensesList}
          categoryList={categoryList}
          isMaintainer={isMaintainer}
        />
      )
    case 'settings':
      return(
        <CommunitySettingsContent isMaintainer={isMaintainer} />
      )
    case 'about':
      if (community?.description) {
        return (
          <BaseSurfaceRounded
            className="flex-1 mb-12 p-4 flex justify-center"
            type="div"
          >
            <ReactMarkdownWithSettings
              className="pt-4"
              markdown={community.description}
            />
          </BaseSurfaceRounded>
        )
      }
    default:
      notFound()
  }
}
