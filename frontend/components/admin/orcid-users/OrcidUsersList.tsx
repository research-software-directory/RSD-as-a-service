// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import ListItemText from '@mui/material/ListItemText'
import EditSectionTitle from '~/components/layout/EditSectionTitle'

export default function OrcidUsersList({orcids, onDeleteOrcid}:
  { orcids: string[], onDeleteOrcid: Function}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [fetchingNames, setFetchingNames] = useState<boolean>(false)

  async function deleteOrcid(orcid: string) {
    const resp = await fetch(`/api/v1/orcid_whitelist?orcid=eq.${orcid}`, {
      headers: createJsonHeaders(token),
      method: 'DELETE'
    })
    if (resp.status !== 204) showErrorMessage('Failed to delete ORCID.')
    onDeleteOrcid()
  }

  async function fetchNameFromOrcids(orcids: string[]): Promise<Map<string, string>> {
    if(orcids.length === 0) return new Map()

    const orcidsJoined = orcids.join('+')
    const url = `https://pub.orcid.org/v3.0/expanded-search/?q=orcid:(${orcidsJoined})`
    const response = await fetch(url, {headers: {...createJsonHeaders(undefined)}})

    if((response).status !== 200) return new Map()

    const json = await response.json()
    const results = json['expanded-result']
    const orcidNameMap = new Map()
    for (const result of results) {
      orcidNameMap.set(result['orcid-id'], result['given-names'] + ' ' + result['family-names'])
    }
    return orcidNameMap
  }

  async function setAllNames() {
    setFetchingNames(true)
    const oldNames = names
    const newNames = await fetchNameFromOrcids(orcids)

    for (const orcid of Array.from(oldNames.keys())) {
      if(!newNames.has(orcid) && typeof oldNames.get(orcid) === 'string') newNames.set(orcid, oldNames.get(orcid) as string)
    }

    setNames(newNames)
    setFetchingNames(false)
  }


  return (
    <div>
      <EditSectionTitle
        title={'Allowed ORCID users'}
      >
        <h2 className="pr-2">{orcids.length}</h2>
      </EditSectionTitle>
      <div className='py-2'></div>
      <div className='h-[2rem] mb-4'>
        {fetchingNames ?
          <CircularProgress size="2rem" />
          :
          <Button
            disabled={orcids?.length===0}
            variant="contained"
            onClick={() => setAllNames()}>
            Fetch names
          </Button>
        }
      </div>
      <List>
        {orcids.map(orcid => {
          return (
            <ListItem
              key={orcid} disableGutters
              secondaryAction={
                <IconButton onClick={() => deleteOrcid(orcid)}><DeleteIcon/></IconButton>
              }
            >
              <ListItemText
                primary={
                  <Link href={`https://orcid.org/${orcid}`} underline="always" target="_blank" rel="noreferrer">
                    {orcid}
                  </Link>
                }
                secondary={
                  <span>{names.get(orcid) ?? ''}</span>
                }
              />
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}
