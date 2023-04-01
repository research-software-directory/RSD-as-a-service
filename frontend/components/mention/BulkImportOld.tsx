// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {ChangeEvent, useState} from 'react'
import TextField from '@mui/material/TextField'
import {extractSearchTerm} from '~/components/software/edit/mentions/utils'
import {getMentionsByDoiFromRsd} from '~/utils/editMentions'
import {useAuth} from '~/auth'
import {MentionItemProps} from '~/types/Mention'
import {getItemsFromCrossref, getItemsFromDatacite} from '~/utils/getDOI'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Switch from '@mui/material/Switch'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function BulkImport({table, entityId, onAdded}: {table: 'mention_for_software' | 'output_for_project' | 'impact_for_project', entityId: string, onAdded: Function}) {
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)
	const [inputEnabled, setInbutEnabled] = useState<boolean>(true)
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false)
	const [searchResults, setSearchResults] = useState<Map<string, SearchResult> | null>(null)
	const [lines, setLines] = useState<string[]>([])
  const {session} = useAuth()
  const token = session.token
  const {showSuccessMessage} = useSnackbar()
  const smallScreen: boolean = useMediaQuery('(max-width:768px)')

  type SearchResult = {
    status: 'valid' | 'invalidDoi' | 'doiNotFound' |'unsupportedRA' | 'unknown',
    include: boolean
    source?: 'RSD' | 'Crossref' | 'DataCite',
    mention?: MentionItemProps
  }

  function entityName(): string {
    switch (table) {
      case 'impact_for_project':
      case 'output_for_project':
        return 'project'
      case 'mention_for_software':
        return 'software'
    }
  }

  async function saveMentions(mentions: MentionItemProps[]) {
    const url = '/api/v1/mention'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(mentions)
    })
    if (resp.status !== 201) {
      throw new Error(`Unexpected response from ${resp.url} with status ${resp.status} and body ${await resp.text()}`)

    }
    return resp.json()
  }

  async function addMentions(ids: string[]) {
    const url = `/api/v1/${table}`
    const entityNameString = entityName()
    const body = ids.map(id => ({[entityNameString]: entityId, mention: id}))
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=ignore-duplicates'
      },
      body: JSON.stringify(body)
    })
    if (resp.status !== 201) {
      throw new Error(`Unexpected response from ${resp.url} with status ${resp.status} and body ${await resp.text()}`)

    }
  }

  function cancelSubmit() {
    setSearchResults(null)
    setInbutEnabled(true)
    setSubmitEnabled(true)
  }

  async function saveAndAddMentions() {
    setSubmitEnabled(false)

    try {
      const mentionsToAdd: MentionItemProps[] = Array.from(searchResults!.values())
      .filter(result => result.include)
      .map(result => result.mention) as MentionItemProps[]

    const newMentionsToSave: MentionItemProps[] = mentionsToAdd
      .filter(mention => mention.id === null)
      .map(m => m)

    const existingIds: string[] = mentionsToAdd
      .filter(mention => mention.id !== null)
      .map(mention => mention.id!)

    const savedMentions: MentionItemProps[] = await saveMentions(newMentionsToSave)

    const idsToSave: string[] = existingIds.concat(savedMentions.map(mention => mention.id!))

    await addMentions(idsToSave)

    showSuccessMessage('Succesfully added mentions (refresh to see)')
    setDialogOpen(false)
    setInbutEnabled(true)
    setSubmitEnabled(false)
    setSearchResults(null)
    setLines([])
    onAdded()
    } catch (error) {
      setSubmitEnabled(true)
      throw error
    }
  }


  function generateErrorMessage(result: SearchResult): string {
    switch (result.status) {
      case 'valid':
        throw new Error('This result is valid')
      case 'invalidDoi':
        return 'not a DOI'
      case 'doiNotFound':
        return 'DOI not found'
      case 'unsupportedRA':
        return 'registration agent of DOI not supported'
      case 'unknown':
        return 'unknown error'
    }
  }

  function closeDialog() {
    setDialogOpen(false)
  }

  function readInput(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const newLines: string[] = event.target.value.split(/\r\n|\n|\r/)
    setLines(newLines)
    if (newLines.length === 0 || newLines.length > 75) setSubmitEnabled(false)
    else setSubmitEnabled(true)
  }

  async function submitLines() {
    setInbutEnabled(false)
    setSubmitEnabled(false)
    const searchData = []
    for (const line of lines) {
      searchData.push(extractSearchTerm(line))
    }

    searchData.forEach(entry => {
      if(entry.type === 'doi') entry.term = entry.term.toLowerCase()
    })

    const mentionResultPerDoi: Map<string, SearchResult> = new Map()

    searchData.forEach(entry => {
      if(entry.type !== 'doi') mentionResultPerDoi.set(entry.term, {status: 'invalidDoi', include: false})
    })

    const dois: string[] = searchData
      .filter(entry => entry.type === 'doi')
      .map(entry => entry.term)
    const existingMentionsResponse = await getMentionsByDoiFromRsd({dois, token})
    const existingMentions: MentionItemProps[] = existingMentionsResponse.message
    existingMentions.forEach(mention => {
      if (mention.doi !== null) {
        mentionResultPerDoi.set(mention.doi.toLowerCase(), {status: 'valid', include: true, source: 'RSD', mention: mention})
      }
    })

    const doisNotInDatabase: string[] = searchData
      .filter(entry => entry.type === 'doi')
      .filter(entry => !mentionResultPerDoi.has(entry.term))
      .map(entry => entry.term)


    const doiRaQuery: string = doisNotInDatabase
      .map(doi => encodeURIComponent(doi))
      .join(',')

    try {
      if (doisNotInDatabase.length > 0) {
        const doiRas: {DOI: string, status?: string, RA?: string}[] = await fetch(`https://doi.org/doiRA/${doiRaQuery}`)
          .then(res => res.json())

        const crossrefDois: string[] = []
        const dataciteDois: string[] = []

        doiRas.forEach(doiRa => {
          const doi = doiRa.DOI.toLowerCase()
          if (doiRa.status) {
            mentionResultPerDoi.set(doi, {status: 'doiNotFound', include: false})
          } else if (doiRa.RA === 'Crossref') {
            crossrefDois.push(doi)
          } else if (doiRa.RA === 'DataCite') {
            dataciteDois.push(doi)
          } else {
            mentionResultPerDoi.set(doi, {status: 'unsupportedRA', include: false})
          }
        })


        const crossrefPromise = getItemsFromCrossref(crossrefDois)
          .then((res: MentionItemProps[]) => {
            res.forEach((crossrefMention: MentionItemProps) => {
              if (crossrefMention.doi !== null) mentionResultPerDoi.set(crossrefMention.doi.toLowerCase(), {status: 'valid', source: 'Crossref', include: true, mention: crossrefMention})
            })
          })


        const datacitePromise = getItemsFromDatacite(dataciteDois)
          .then((res: any) => {
            res.message.forEach((dataciteMention: MentionItemProps) => {
              if (dataciteMention.doi !== null) mentionResultPerDoi.set(dataciteMention.doi.toLowerCase(), {status: 'valid', source: 'DataCite', include: true, mention: dataciteMention})
            })
          })

        await Promise.all([crossrefPromise, datacitePromise])

        doisNotInDatabase.forEach(doi => {
          if (!mentionResultPerDoi.has(doi)) {
            mentionResultPerDoi.set(doi, {status: 'unknown', include: false})
          }
        })
      }
    } catch (error) {
      setInbutEnabled(true)
      setSubmitEnabled(true)
      throw error
    }

    setSearchResults(mentionResultPerDoi)
    setInbutEnabled(true)
    setSubmitEnabled(true)
  }

  if (smallScreen) return null

	return (
    <>
        <Button onClick={() => setDialogOpen(true)}>
          Bulk add mentions
        </Button>
        <Dialog
          maxWidth='md'
          sx={{
            minWidth: '40rem',
            '.MuiPaper-root': {
              width: '50vw',
              height: '80vh'
            }
          }}
          open={dialogOpen}
          onClose={() => closeDialog()}
        >
        {searchResults === null &&
          <>
            <DialogTitle>
              Bulk import mentions
            </DialogTitle>
            <DialogContent sx={{minWidth: '40rem'}}>
              <TextField
                sx={{margin: '1rem' , width: '90%'}}
                label="Paste one DOI per line in the textbox (max 75):"
                defaultValue={lines.join('\n')} multiline disabled={!inputEnabled}
                onChange={event => readInput(event)}
                rows={22}
              >
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button disabled={!submitEnabled} onClick={() => submitLines()}>
                Submit!
              </Button>
            </DialogActions>
          </>
        }
        {searchResults !== null &&
          <>
            <DialogTitle>
              Results ({searchResults.size})
            </DialogTitle>
            <DialogContent>
              <List>
                {Array.from(searchResults.keys()).map(doi => {
                  const result = searchResults.get(doi)!
                  const mention = searchResults.get(doi)?.mention!
                  return (
                    <ListItem key = {doi}
                    secondaryAction={
                      <Switch
                        disabled={result?.status !== 'valid'}
                        defaultChecked={result.include}
                        onChange={() => {result.include = !result.include}}
                      />
                    }
                    sx={{
                      paddingRight:'5rem',
                      '&:hover': {
                        backgroundColor:'grey.100'
                      },
                    }}
                    >
                      <ListItemText
                        primary={
                          <a href={`https://doi.org/${doi}`} target="_blank">
                            {doi}
                          </a>
                        }
                        secondary={
                          result?.status === 'valid' ?
                          <>
                            <span className="text-secondary">{mention.title}</span><br/>
                            <span>{mention.authors}</span><br/>
                            <span>Source: {result.source}</span>
                          </>
                          :<span className="text-error">{generateErrorMessage(result)}</span>
                        }
                      />
                    </ListItem>
                  )
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button disabled={!submitEnabled} onClick={() => saveAndAddMentions()}>
                Add mentions
              </Button>
              <Button disabled={!submitEnabled} onClick={() => cancelSubmit()}>
                Cancel
              </Button>
            </DialogActions>
          </>
        }
        </Dialog>
    </>
  )
}
