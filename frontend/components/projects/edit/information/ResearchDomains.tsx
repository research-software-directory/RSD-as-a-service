import {useEffect, useState} from 'react'
import Select from '@mui/material/Select'

import {useFieldArray, useFormContext} from 'react-hook-form'

import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

import {projectInformation as config} from './config'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useResearchDomains from './useResearchDomains'
import {sortOnStrProp} from '~/utils/sortFn'
import logger from '~/utils/logger'
import {EditProject, ResearchDomain} from '~/types/Project'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

export default function ResearchDomains() {
  const {control} = useFormContext<EditProject>()
  const {fields, remove, replace} = useFieldArray({
    control,
    name:'research_domains'
  })
  // save current filter selection
  const [l1Selected, setL1Selected] = useState<ResearchDomain | null>(null)
  const [l2Selected, setL2Selected] = useState<ResearchDomain | null>(null)
  const [l3Selected, setL3Selected] = useState<ResearchDomain | null>(null)

  // filtered domains lists per level 1,2 en 3
  const {l1Domains,l2Domains,l3Domains} = useResearchDomains({l1Selected,l2Selected})

  // console.group('ResearchDomains')
  // console.log('l1Domains...', l1Domains)
  // console.log('l2Domains...', l2Domains)
  // console.log('l3Domains...', l3Domains)
  // console.log('selected...', selected)
  // console.log('fields...', fields)
  // console.groupEnd()

  useEffect(() => {
    if (l1Domains) {
      // reset all selected values
      setL1Selected(null)
      setL2Selected(null)
      setL3Selected(null)
    }
  },[l1Domains])

  function selectDomain({key,level}:{key:string,level:'l1'|'l2'|'l3'}) {
    switch (level) {
      case 'l1':
        const root = l1Domains.filter(item => item.key === key)
        if (root.length === 1) {
          // reset lower levels
          setL2Selected(null)
          setL3Selected(null)
          // set new top level
          setL1Selected(root[0])
        }
        break
      case 'l2':
        const l2child = l2Domains.filter(item => item.key === key)
        if (l2child.length === 1) {
          // reset lower level
          setL3Selected(null)
          // set new 2nd level
          setL2Selected(l2child[0])
        }
        break
      case 'l3':
        const l3child = l3Domains.filter(item => item.key === key)
        if (l3child.length === 1) setL3Selected(l3child[0])
        break
      default:
        logger(`ResearchDomain.selectDomain level ${level} NOT SUPPORTED`,'warn')
    }
  }

  function getDomainsToAdd() {
    const toAdd=[]
    if (l1Selected) {
      const find = fields.filter(item => item.key === l1Selected.key)
        // selected.filter(item => item.key === l1Selected.key)
      if (find.length === 0) {
        toAdd.push(l1Selected)
      }
    }
    if (l2Selected) {
      const find = fields.filter(item => item.key === l2Selected.key)
      if (find.length === 0) {
        toAdd.push(l2Selected)
      }
    }
    if (l3Selected) {
      const find = fields.filter(item => item.key === l3Selected.key)
      if (find.length === 0) {
        toAdd.push(l3Selected)
      }
    }
    return toAdd
  }

  function addDomains() {
    // console.log('addDomains...')
    const toAdd = getDomainsToAdd()
    // abort if nothing to add
    if (toAdd.length === 0 ) return
    // if (toAdd.length > 0) {
    const newDomains = [
      ...fields,
      ...toAdd
    ].sort((a, b) => sortOnStrProp(a, b, 'key'))
    // replace with ordered items
    replace(newDomains)
  }

  function onRemove(pos: number) {
    remove(pos)
  }

  return (
    <>
      <EditSectionTitle
        title={config.research_domain.title}
        subtitle={config.research_domain.subtitle}
      />
      <div className="flex flex-wrap pb-4">
        {
          fields.map((item, pos) => (
            <Chip
              key={item.key}
              title={item.description}
              label={item.name}
              onDelete={() => onRemove(pos)}
              sx={{
                marginBottom: '1rem',
                marginRight: '0.5rem'
              }}
            />
          ))
        }
      </div>
      <FormControl
        variant="standard"
        sx={{
          width: '100%',
          // maxWidth: '30rem'
        }}
      >
        <InputLabel
          shrink={true}
          id="select-l1-domain">
          Level 1
        </InputLabel>
        <Select
          id="select-l1-domain"
          value={l1Selected?.key ?? ''}
          onChange={({target}:{target:any}) => {
            selectDomain({
              key: target.value,
              level: 'l1'
            })
          }}
        >
          {l1Domains
            .sort((a,b)=>sortOnStrProp(a,b,'name'))
            .map(item => {
            return (
              <MenuItem
                key={item.key}
                title={item.description}
                value={item.key}>
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <div className="py-2"></div>
      <FormControl
        variant="standard"
        sx={{
          width: '100%',
          // maxWidth: '30rem'
        }}
      >
        <InputLabel
          shrink={true}
          id="select-l2-domain">
          Level 2
        </InputLabel>

        <Select
          id="select-l2-domain"
          value={l2Selected?.key ?? ''}
          onChange={({target}:{target:any}) => {
            selectDomain({
              key: target.value,
              level: 'l2'
            })
          }}
        >
          {l2Domains
            .sort((a,b)=>sortOnStrProp(a,b,'name'))
            .map(item => {
            return (
              <MenuItem
                title={item.description}
                key={item.key}
                value={item.key}
                sx={{
                  // maxWidth: '30rem',
                  whiteSpace: 'break-spaces'
                }}
              >
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <div className="py-2"></div>
      <FormControl
        variant="standard"
        sx={{
          width: '100%',
          // not here
          // maxWidth: 'calc(100% - 4rem)',
        }}
      >
        <InputLabel
          shrink={true}
          id="select-l3-domain">
          Level 3
        </InputLabel>

        <Select
          id="select-l3-domain"
          value={l3Selected?.key ?? ''}
          onChange={({target}:{target:any}) => {
            selectDomain({
              key: target.value,
              level: 'l3'
            })
          }}
          sx={{
            // nor here
            // maxWidth: '20rem',
          }}
        >
          {l3Domains
            .sort((a,b)=>sortOnStrProp(a,b,'name'))
            .map(item => {
            return (
              <MenuItem
                title={item.description}
                key={item.key}
                value={item.key}
                sx={{
                  // maxWidth: 'calc(100% - 4rem)',
                  whiteSpace: 'break-spaces'
                }}
              >
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <div className="flex justify-end py-4">
        <Button
          onClick={addDomains}
          sx={{margin: '0rem 0rem 0.5rem 1rem'}}
          disabled={l1Domains===null}
        >
          Add
        </Button>
      </div>
    </>
  )
}
