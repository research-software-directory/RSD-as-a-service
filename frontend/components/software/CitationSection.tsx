// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState,useEffect} from 'react'
import {SelectChangeEvent} from '@mui/material/Select'

import DarkThemeProvider from '~/components/layout/DarkThemeProvider'
import PageContainer from '~/components/layout/PageContainer'
import {SoftwareVersion} from '~/components/software/apiSoftware'
import CiteDropdown from './CiteDropdown'
import CitationDoi from './CitationDoi'
import CitationDownload from './CitationDownload'

export default function CitationSection({releases,concept_doi}:
{releases:SoftwareVersion[]|null, concept_doi:string|null}) {
  const [version, setVersion]=useState('')
  const [citation, setCitation] = useState<SoftwareVersion>()

  useEffect(()=>{
    // select first option by default
    if (releases && releases.length > 0){
      setVersion('0')
      setCitation(releases[0])
    }
  },[releases])

  // do not render section if no release data
  if (typeof releases==='undefined' || releases===null || releases.length===0) {
    // only return spacer
    return (
      <section className="py-4"></section>
    )
  }
  // prepare release versions
  const versions = releases?.map((item, pos) => {
    if (item?.version) {
      return {label:item?.version,value:`${pos}`}
    } else {
      return {label: item.doi,value:`${pos}`}
    }
  })

  function onVersionChange({target}:{target:SelectChangeEvent['target']}){
    const pos = Number.parseInt(target?.value)
    if (releases) {
      const cite = releases[pos]
      // update local state
      setVersion(target?.value)
      setCitation(cite)
    }
  }

  // console.group('CitationSection')
  // console.log('releases...',releases)
  // console.log('concept_doi...',concept_doi)
  // console.log('version...',version)
  // console.log('citation...',citation)
  // console.groupEnd()

  // render section
  return (
    <PageContainer className='lg:px-4'>
      <article className="flex flex-col min-h-[16rem] px-4 py-8 bg-secondary text-base-100 md:flex-row lg:py-10 lg:px-16 lg:translate-y-[-3rem]">
        <DarkThemeProvider>
          <div className="flex-1 flex flex-col justify-between">
            <h2 className='py-4'
              data-testid="citation-section-title">
              Cite this software
            </h2>
            {
              versions?.length > 0 ?
                <CiteDropdown
                  label="Software version:"
                  options={versions}
                  value={version}
                  onChange={onVersionChange}
                />
                :null
            }
          </div>
          <div className="flex-3 flex flex-col justify-between md:px-4">
            <CitationDoi doi={citation?.doi ?? concept_doi ?? ''} />
            <CitationDownload doi={citation?.doi ?? concept_doi ?? ''} />
          </div>
        </DarkThemeProvider>
      </article>
    </PageContainer>
  )
}
