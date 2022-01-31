import {useState,useEffect} from 'react'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {SelectChangeEvent} from '@mui/material/Select'

import PageContainer from '../layout/PageContainer'
import CiteDropdown from './CiteDropdown'
import CitationDoi from './CitationDoi'
import CitationDownload from './CitationDownload'
import {SoftwareCitationInfo,SoftwareCitationContent} from '../../types/SoftwareCitation'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function CitationSection({citationInfo,concept_doi}:
  {citationInfo:SoftwareCitationInfo, concept_doi:string|null}) {
  const [version, setVersion]=useState('')
  const [citation, setCitation] = useState<SoftwareCitationContent>()

  useEffect(()=>{
    // select first option by default
    if (citationInfo?.release_content?.length > 0){
      setVersion('0')
      setCitation(citationInfo?.release_content[0])
    }
  },[citationInfo])

  // do not render section if no data or not citable
  if (!citationInfo || citationInfo.is_citable === false) {
    // only return spacer
    return (
      <section className="py-4"></section>
    )
  }
  // prepare release versions
  const versions = citationInfo?.release_content?.map((item,pos)=>{
    return {label:item.tag,value:`${pos}`}
  })

  function onVersionChange({target}:{target:SelectChangeEvent['target']}){
    const pos = parseInt(target?.value)
    const cite = citationInfo?.release_content[pos]
    // update local state
    setVersion(target?.value)
    setCitation(cite)
  }

  // render section
  return (
    <ThemeProvider theme={darkTheme}>
      <PageContainer className='lg:px-4'>
        <article className="flex flex-col min-h-[16rem] px-4 py-8 bg-secondary text-white md:flex-row lg:py-10 lg:px-16 lg:translate-y-[-3rem]">
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
            <CitationDoi doi={citation?.doi ?? concept_doi ?? ''} />
            {
              // only when citability full
              citation?.citability==='full' ?
                <CitationDownload citation={citation} />
                :null
            }
          </div>

        </article>
      </PageContainer>
    </ThemeProvider>
  )
}
