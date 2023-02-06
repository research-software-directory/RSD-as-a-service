// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {SelectChangeEvent} from '@mui/material/Select'

import DarkThemeSection from '../layout/DarkThemeSection'
import PageContainer from '../layout/PageContainer'
import CiteDropdown from './CiteDropdown'
import CitationDoi from './CitationDoi'
import CitationDownload from './CitationDownload'
// import {SoftwareCitationInfo,SoftwareCitationContent} from '../../types/SoftwareCitation'
import {SoftwareReleaseInfo} from '../organisation/releases/useSoftwareReleases'

export default function CitationSection({citationInfo,concept_doi}:
  {citationInfo:SoftwareReleaseInfo[]|null, concept_doi:string|null}) {
  const [version, setVersion]=useState('')
  const [citation, setCitation] = useState<SoftwareReleaseInfo>()

  useEffect(()=>{
    // select first option by default
    if (citationInfo && citationInfo.length > 0){
      setVersion('0')
      setCitation(citationInfo[0])
    }
  },[citationInfo])

  // do not render section if no release data
  if (typeof citationInfo==='undefined' || citationInfo===null || citationInfo.length===0) {
    // only return spacer
    return (
      <section className="py-4"></section>
    )
  }
  // prepare release versions
  const versions = citationInfo?.map((item, pos) => {
    if (item?.release_tag) {
      return {label:item?.release_tag,value:`${pos}`}
    } else {
      return {label: item.release_doi,value:`${pos}`}
    }
  })

  function onVersionChange({target}:{target:SelectChangeEvent['target']}){
    const pos = parseInt(target?.value)
    if (citationInfo) {
      const cite = citationInfo[pos]
      // update local state
      setVersion(target?.value)
      setCitation(cite)
    }
  }

  // render section
  return (
    <PageContainer className='lg:px-4'>
      <article className="flex flex-col min-h-[16rem] px-4 py-8 bg-secondary text-white md:flex-row lg:py-10 lg:px-16 lg:translate-y-[-3rem]">
        <DarkThemeSection>
        <div className="flex-1 flex flex-col justify-between">
          <h2 className='py-4'
            data-testid="citation-section-title">
              Cite this software
          </h2>
          {
            versions?.length > 0 ?
              <CiteDropdown
                label="Choose a version:"
                options={versions}
                value={version}
                onChange={onVersionChange}
              />
              :null
          }
        </div>
        <div className="flex-[3] flex flex-col justify-between md:px-4">
          <CitationDoi doi={citation?.release_doi ?? concept_doi ?? ''} />
          {/* NOTE! temporarly dissabled  */}
          <CitationDownload doi={citation?.release_doi ?? concept_doi ?? ''} />
        </div>
        </DarkThemeSection>
      </article>
    </PageContainer>
  )
}
