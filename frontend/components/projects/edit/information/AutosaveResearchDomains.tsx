// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Select from '@mui/material/Select'

import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {projectInformation as config} from './config'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useResearchDomains from './useResearchDomains'
import {sortOnStrProp} from '~/utils/sortFn'
import logger from '~/utils/logger'
import {ResearchDomain} from '~/types/Project'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import {addResearchDomainToProject, deleteResearchDomainFromProject} from '~/components/projects/edit/apiEditProject'

type ResearchDomainsProps = {
  project_id: string
  research_domains: ResearchDomain[]
}

export default function AutosaveResearchDomains({project_id, research_domains}: ResearchDomainsProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [domains, setDomains] = useState(research_domains)
  const [l1Selected, setL1Selected] = useState<ResearchDomain | null>(null)
  const [l2Selected, setL2Selected] = useState<ResearchDomain | null>(null)
  const [l3Selected, setL3Selected] = useState<ResearchDomain | null>(null)

  // filtered domains lists per level 1,2 en 3
  const {l1Domains,l2Domains,l3Domains} = useResearchDomains({l1Selected,l2Selected})

  // console.group('ResearchDomains')
  // console.log('l1Selected...', l1Selected)
  // console.log('l1Domains...', l1Domains)
  // console.log('l2Domains...', l2Domains)
  // console.log('l3Domains...', l3Domains)
  // console.log('domains...', domains)
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
      const find = domains.filter(item => item.key === l1Selected.key)
      // selected.filter(item => item.key === l1Selected.key)
      if (find.length === 0) {
        toAdd.push(l1Selected)
      }
    }
    if (l2Selected) {
      const find = domains.filter(item => item.key === l2Selected.key)
      if (find.length === 0) {
        toAdd.push(l2Selected)
      }
    }
    if (l3Selected) {
      const find = domains.filter(item => item.key === l3Selected.key)
      if (find.length === 0) {
        toAdd.push(l3Selected)
      }
    }
    return toAdd
  }

  async function addDomains() {
    // console.log('addDomains...')
    const toAdd = getDomainsToAdd()
    // abort if nothing to add
    if (toAdd.length === 0) return
    // convert to data
    const data = toAdd.map(item => ({
      project: project_id,
      research_domain: item.id
    }))
    // make request
    const resp = await addResearchDomainToProject({
      data,
      token
    })
    if (resp.status === 200) {
      const newDomains = [
        ...domains,
        ...toAdd
      ].sort((a, b) => sortOnStrProp(a, b, 'key'))
      // replace with ordered items
      setDomains(newDomains)
    } else {
      showErrorMessage(`Failed to add research domains. ${resp.message}`)
    }
  }

  async function onRemove(pos: number) {
    const item = domains[pos]
    if (item.id) {
      const resp = await deleteResearchDomainFromProject({
        project: project_id,
        research_domain: item.id,
        token
      })
      // if failed
      if (resp.status === 200) {
        const items = [
          ...domains.slice(0, pos),
          ...domains.slice(pos+1)
        ]
        setDomains(items)
      } else {
        showErrorMessage(`Failed to remove ${item.name}. ${resp.message}`)
      }
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.research_domain.title}
        subtitle={config.research_domain.subtitle}
        infoLink={config.research_domain.infoLink}
      >
        <Button
          data-testid="add-research-domains"
          variant='contained'
          startIcon={<AddIcon />}
          onClick={addDomains}
          disabled={l1Selected===null}
        >
          Add
        </Button>
      </EditSectionTitle>
      <div className="flex flex-col mb-4">
        <FormControl
          variant="standard"
          fullWidth
          // sx={{
          //   width: '100%',
          //   // maxWidth: '30rem'
          // }}
        >
          <InputLabel
            shrink={true}
          >
            Level 1
          </InputLabel>
          <Select
            data-testid="l1-domain-select"
            // variant='filled'
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
                    data-testid="l1-domain-item"
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
          fullWidth
          // sx={{
          //   width: '100%',
          //   // maxWidth: '30rem'
          // }}
        >
          <InputLabel
            shrink={true}
          >
            Level 2
          </InputLabel>

          <Select
            data-testid="l2-domain-select"
            value={l2Selected?.key ?? ''}
            onChange={({target}:{target:any}) => {
              selectDomain({
                key: target.value,
                level: 'l2'
              })
            }}
            disabled={l1Selected ? false : true}
          >
            {l2Domains
              .sort((a,b)=>sortOnStrProp(a,b,'name'))
              .map(item => {
                return (
                  <MenuItem
                    data-testid="l2-domain-item"
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
          fullWidth
        >
          <InputLabel
            shrink={true}>
            Level 3
          </InputLabel>

          <Select
            data-testid="l3-domain-select"
            value={l3Selected?.key ?? ''}
            onChange={({target}:{target:any}) => {
              selectDomain({
                key: target.value,
                level: 'l3'
              })
            }}
            sx={{
              // maxWidth: '20rem',
            }}
            disabled={l2Selected ? false : true}
          >
            {l3Domains
              .sort((a,b)=>sortOnStrProp(a,b,'name'))
              .map(item => {
                return (
                  <MenuItem
                    data-testid="l3-domain-item"
                    title={item.description}
                    key={item.key}
                    value={item.key}
                    sx={{
                    // maxWidth: 'calc(100% - 4rem)',
                    // maxWidth:'20rem',
                      whiteSpace: 'break-spaces'
                    }}
                  >
                    {item.name}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-wrap">
        {
          domains.map((item, pos) => (
            <Chip
              data-testid="research-domain-chip"
              key={item.key}
              title={item.description}
              label={`${item.key}: ${item.name}`}
              onDelete={() => onRemove(pos)}
              sx={{
                marginBottom: '1rem',
                marginRight: '0.5rem',
                maxWidth: '21rem'
              }}
            />
          ))
        }
      </div>
    </>
  )
}
