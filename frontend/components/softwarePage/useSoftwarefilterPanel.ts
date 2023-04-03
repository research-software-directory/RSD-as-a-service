// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {useEffect, useState} from 'react'
import {ProgrammingLanguage} from '~/components/software/filter/softwareFilterApi'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {buildFilterUrl, softwareListUrl} from '~/utils/postgrestUrl'
import {getSoftwareList} from '~/utils/getSoftware'
import {Keyword} from '../keyword/FindKeyword'
import {License} from '~/components/softwarePage/softwarePagePanel'

export default function useSoftwarefilterPanel() {
  const router = useRouter()
  const baseUrl = getBaseUrl()

  const [orderBy, setOrderBy] = useState<string>('')
  const [search, setSearch] = useState('')

  // keyword list is an array of objects or a string
  const [keywordsList, setKeywordsList] = useState<Keyword[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])

  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([])
  const [languagesList, setLanguagesList] = useState<ProgrammingLanguage[]>([])

  const [licenses, setLicenses] = useState<License[]>([])
  const [licensesList, setLicensesList] = useState<License[]>([])

  const [software, setSoftware] = useState<{ count: number, items: SoftwareListItem[] }>({
    count: 0,
    items: []
  })

  useEffect(() => {
    if (baseUrl) {
      // fetch keywords list
      fetch(`${baseUrl}/rpc/keyword_count_for_software?keyword=ilike.**&cnt=gt.0&order=cnt.desc.nullslast,keyword.asc`)
        .then((response) => response.json())
        .then((data) => setKeywordsList(data))

      // fetch programme languages list
      fetch(`${baseUrl}/rpc/prog_lang_cnt_for_software?prog_lang=ilike.**&cnt=gt.0&order=cnt.desc.nullslast,prog_lang.asc`)
        .then((response) => response.json())
        .then((data) => setLanguagesList(data))

      // fetch licenses list
      fetch(`${baseUrl}/rpc/license_cnt_for_software`)
        .then((response) => response.json())
        .then((data) => {
          setLicensesList(data)
        })
    }
  }, [baseUrl])

  useEffect(() => {
    if (search !== '') {
      const {search:searchInput} = ssrSoftwareParams(router.query)
      if (searchInput && searchInput !== '') {
        setSearch(searchInput)
      } else {
        setSearch('')
      }
    }
  }, [router.query,search])

  useEffect(() => {
    if (orderBy !== '') {
      const {order} = ssrSoftwareParams(router.query)
      if (order && order !== '') {
        setOrderBy(order)
      } else {
        setOrderBy('')
      }
    }
  }, [router.query, orderBy])

  useEffect(() => {
    if (keywordsList.length > 0) {
      const {keywords} = ssrSoftwareParams(router.query)
      if (keywords && keywords.length > 0) {
        const selectedKeywords: Keyword[] = keywordsList.filter(option => {
          return keywords.includes(option.keyword)
        })
        setKeywords(selectedKeywords)
      } else {
        setKeywords([])
      }
    }
  }, [keywordsList, router.query])

  useEffect(() => {
    if (languagesList.length > 0) {
      const {prog_lang} = ssrSoftwareParams(router.query)
      if (prog_lang && prog_lang.length > 0) {
        const selectedProgLang: ProgrammingLanguage[] = languagesList.filter(option => {
          return prog_lang.includes(option.prog_lang)
        })
        setLanguages(selectedProgLang)
      } else {
        setLanguages([])
      }
    }
  }, [languagesList, router.query])

  useEffect(() => {
    if (licensesList.length > 0) {
      const {licenses} = ssrSoftwareParams(router.query)
      if (licenses && licenses.length > 0) {
        const selected: License[] = licensesList.filter(option => {
          return licenses.includes(option.license)
        })
        setLicenses(selected)
      } else {
        setLicenses([])
      }
    }
  }, [licensesList, router.query])

  useEffect(() => {
    let orderBy
    // extract params from page-query
    const {search, keywords, prog_lang, licenses, order, page} = ssrSoftwareParams(router.query)

    // update components based on query params
    if (order) {
      setOrderBy(order)
      orderBy = `${orderBy}.desc.nullslast`
    }
    if (search) {
      setSearch(search)
    }

    //build api url
    const url = softwareListUrl({
      baseUrl,
      search,
      keywords,
      licenses,
      order: orderBy,
      prog_lang,
      limit: 24,
      offset: 24 * (page ?? 0)
    })

    // get software list from api
    getSoftwareList({url})
      .then(resp => {
        setSoftware({
          count: resp.count ?? 0,
          items: resp.data ?? []
        })
      })

  }, [router.query, baseUrl])


  function handleQueryChange(key: string, value: string | string[]) {
    const url = buildFilterUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      [key]: value,
      // start from first page
      page: 0,
      // use 24 items
      rows: 24
    }, 'highlights')

    // update page url
    router.push(url)
  }

  function getFilterCount() {
    let count = 0
    if (orderBy !== '') count++
    if (keywords.length > 0) count++
    if (languages.length > 0) count++
    if (licenses.length > 0) count++
    if (search !== '') count++
    return count
  }

  function resetFilters() {
    // return pathname without filters/query
    router.replace(router.pathname, undefined, {shallow: true})
  }

  return {
    orderBy, setOrderBy,
    keywords, keywordsList,
    languages, languagesList,
    licenses, licensesList,
    software, setSoftware,
    search, setSearch,
    handleQueryChange,
    getFilterCount,
    resetFilters
  }
}

