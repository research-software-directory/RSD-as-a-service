import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getActiveModuleNames, getRsdSettings} from '~/config/getSettingsServerSide'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {highlightsListUrl} from '~/utils/postgrestUrl'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import FiltersPanel from '~/components/filter/FiltersPanel'
import {getSoftwareList} from '~/components/software/apiSoftware'
import SoftwareFilters from '~/components/software/overview/filters'
import {
  highlightKeywordsFilter,
  highlightLanguagesFilter,
  highlightLicensesFilter,
  softwareCategoriesFilter
} from '~/components/software/overview/filters/softwareFiltersApi'
import {highlightOrderOptions} from '~/components/software/overview/filters/softwareOrderOptions'
import SoftwareSearchSection from '~/components/software/overview/search/SoftwareSearchSection'
import SoftwareOverviewContent from '~/components/software/overview/SoftwareOverviewContent'

export const metadata: Metadata = {
  title: `Software | ${app.title}`,
  description: 'The list of research software registered in the Research Software Directory.'
}

export default async function SpotlightsOverviewPage({
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}>) {

  // extract params, user preferences and active modules
  const [params, {rsd_page_rows},modules,{host}] = await Promise.all([
    searchParams,
    getUserSettings(),
    getActiveModuleNames(),
    getRsdSettings()
  ])

  if (modules?.includes('software')===false){
    return notFound()
  }

  // extract params from page-query
  const {
    search, keywords, prog_lang,
    licenses, categories, order, rows, page
  } = ssrSoftwareParams(params)

  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  let orderBy='slug.asc', offset=0
  // calculate offset when page & rows present
  if (page_rows && page) {
    offset = page_rows * (page - 1)
  }

  // default order
  let highlightOrder = order ?? 'mention_cnt'
  if (order) {
    // extract order direction from definitions
    const orderInfo = highlightOrderOptions.find(item=>item.key===order)
    // ordering options require "stable" secondary order
    // to ensure proper pagination. We use slug for this purpose
    if (orderInfo) {
      orderBy=`${orderInfo.key}.${orderInfo.direction},slug.asc`
      highlightOrder = orderInfo.key
    }
  }

  // construct postgREST api url with query params
  const url = highlightsListUrl({
    baseUrl: getBaseUrl(),
    search,
    keywords,
    licenses,
    prog_lang,
    categories,
    order: orderBy,
    limit: page_rows,
    offset
  })

  // get highlights items, filter options AND highlights
  const [
    highlights,
    keywordsList,
    languagesList,
    licensesList,
    categoriesList
  ] = await Promise.all([
    getSoftwareList({url}),
    highlightKeywordsFilter({search, keywords, prog_lang, licenses, categories}),
    highlightLanguagesFilter({search, keywords, prog_lang, licenses, categories}),
    highlightLicensesFilter({search, keywords, prog_lang, licenses, categories}),
    softwareCategoriesFilter({search, keywords, prog_lang, licenses, categories},'highlight_category_filter')
  ])

  const numPages = Math.ceil(highlights.count / page_rows)
  const filterCnt = getFilterCount()

  // console.group('SpotlightsOverviewPage')
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('order...', order)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('count...', highlights.count)
  // console.log('keywordsList...', keywordsList)
  // console.log('languagesList...', languagesList)
  // console.log('licensesList...', licensesList)
  // console.log('highlights...', highlights.data)
  // console.log('categories...', categories)
  // console.log('categoriesList...', categoriesList)
  // console.groupEnd()

  function getFilterCount() {
    let count = 0
    if (keywords) count++
    if (prog_lang) count++
    if (licenses) count++
    if (categories) count++
    if (search) count++
    return count
  }

  return (
    <>
      <h1 className="mt-8" id="list-top">
        All {host.software_highlights?.title}
      </h1>
      {host.software_highlights?.description &&
        <p>{host.software_highlights?.description}</p>
      }
      {/* Page grid with 2 sections: left filter panel and main content */}
      <section className="flex-1 my-4 grid gap-8 md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_3fr] lg:container lg:mx-auto xl:grid-cols-[1fr_4fr]">
        {/* Filters panel large screen */}
        <FiltersPanel>
          <SoftwareFilters
            keywords={keywords ?? []}
            keywordsList={keywordsList}
            languages={prog_lang ?? []}
            languagesList={languagesList}
            licenses={licenses ?? []}
            licensesList={licensesList}
            categories={categories ?? []}
            categoryList={categoriesList ?? []}
            orderBy={highlightOrder}
            filterCnt={filterCnt}
            hasRemotes={false}
            highlightsOnly={true}
          />
        </FiltersPanel>
        {/* Search & main content section */}
        <div className="flex-1 flex flex-col">
          <SoftwareSearchSection
            count={highlights.count}
            filterModal={
              <SoftwareFilters
                keywords={keywords ?? []}
                keywordsList={keywordsList}
                languages={prog_lang ?? []}
                languagesList={languagesList}
                licenses={licenses ?? []}
                licensesList={licensesList}
                categories={categories ?? []}
                categoryList={categoriesList ?? []}
                orderBy={highlightOrder}
                filterCnt={filterCnt}
                hasRemotes={false}
                highlightsOnly={true}
              />
            }
          />
          {/* Software content: masonry, cards or list */}
          <SoftwareOverviewContent
            software={highlights.data}
            hasRemotes={false}
          />
          {/* Pagination */}
          <PaginationLinkApp
            count={numPages}
            page={page ?? 1}
            className='mt-4'
          />
        </div>
      </section>
    </>
  )
}
