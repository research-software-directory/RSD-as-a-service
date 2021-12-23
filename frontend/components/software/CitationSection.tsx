import {useState} from 'react'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {SelectChangeEvent} from '@mui/material/Select'

import PageContainer from '../layout/PageContainer'
import CiteDropdown from './CiteDropdown'
import DoiLabel from './DoiLabel'
import CitationFormat from './CitationFormat'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const versions = [
  {label:'2.0.1-beta',value:'0'},
  {label:'2.0.0',value:'1'},
  {label:'1.9.5',value:'2'},
  {label:'1.9.4',value:'3'},
  {label:'1.9.3',value:'4'},
  {label:'1.9.2',value:'5'},
  {label:'1.9.1',value:'6'},
  {label:'1.9.0',value:'7'},
  {label:'1.8.9',value:'8'},
  {label:'1.8.8',value:'9'},
  {label:'1.8.7',value:'10'},
  {label:'1.8.6',value:'11'},
  {label:'1.8.5',value:'12'},
  {label:'1.8.41',value:'13'},
  {label:'1.8.4',value:'14'},
  {label:'1.8.3',value:'15'},
  {label:'1.8.2',value:'16'},
  {label:'1.8.1',value:'17'},
  {label:'1.8.0',value:'18'},
  {label:'1.7.5',value:'19'},
  {label:'1.6.5',value:'20'},
  {label:'1.5.5',value:'21'},
  {label:'1.4.5',value:'22'},
  {label:'1.3.5',value:'23'}
]

export default function CitationSection({concept_doi}:{concept_doi:string}) {
  const [version,setVersion]=useState('')

  function onVersionChange({target}:{target:SelectChangeEvent['target']}){
    setVersion(target?.value)
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <PageContainer>
        <article className="flex flex-col md:flex-row px-4 py-8 bg-secondary text-white lg:py-10 lg:px-16 lg:translate-y-[-3rem]">
          <div className="flex-1 flex flex-col justify-between">
            <h2 className='py-4'>Cite this software</h2>
            <CiteDropdown
              label="Choose a version:"
              options={versions}
              value={version}
              onChange={onVersionChange}
            />
          </div>
          <div className="flex-[3] md:px-4">
            <DoiLabel concept_doi={concept_doi} />
            <CitationFormat />
          </div>

        </article>
      </PageContainer>
    </ThemeProvider>
  )
}
