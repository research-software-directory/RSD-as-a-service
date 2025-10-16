// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import PostAddIcon from '@mui/icons-material/PostAdd'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {MentionItemProps} from '~/types/Mention'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ImportReportBody from './ImportReportBody'
import DoiInputBody from './DoiInputBody'
import {DoiBulkImportReport, addMentions, linkMentionToEntity} from './apiImportMentions'

export type SearchResult = {
  doi: string
  status: 'valid' | 'invalidDoi' | 'doiNotFound' | 'alreadyImported' | 'unknown',
  include: boolean
  source?: 'RSD' | 'Crossref' | 'DataCite' | 'OpenAlex',
  mention?: MentionItemProps
}

type ImportMentionsProps = {
  entityId: string
  table: 'mention_for_software' | 'output_for_project' | 'impact_for_project',
  onSuccess:()=>void
}

export default function ImportMentions({table, entityId, onSuccess}:ImportMentionsProps) {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:768px)')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<DoiBulkImportReport>(null)

  function entityName(): string {
    switch (table) {
      case 'impact_for_project':
      case 'output_for_project':
        return 'project'
      case 'mention_for_software':
        return 'software'
    }
  }

  function closeDialog() {
    // reset results
    setSearchResults(null)
    // close dialog
    setDialogOpen(false)
  }

  async function importMentions(selection:SearchResult[]) {
    // nothing to add
    if (selection.length===0) {
      // we just close dialog
      closeDialog()
    }

    // split into new and existing mentions in RSD
    const newMentionsToSave: MentionItemProps[] = []
    const mentionIdsToSave: string[] = []

    selection?.forEach((result) => {
      if (result.mention) {
        if (result.mention.id === null) {
          newMentionsToSave.push(result.mention)
        } else {
          mentionIdsToSave.push(result.mention.id)
        }
      } else {
        logger('importMentions...result.mention...undefined')
      }
    })

    const save = await addMentions({mentions: newMentionsToSave, token})
    if (save.status !== 200) {
      showErrorMessage(`Failed to import. ${save.message}`)
      return false
    }
    // add id's of newly created mentions
    save.message.forEach((mention:MentionItemProps) => {
      if (mention.id) mentionIdsToSave.push(mention.id)
    })

    const resp = await linkMentionToEntity({
      ids: mentionIdsToSave,
      table,
      entityName: entityName() ?? 'software',
      entityId,
      token
    })

    if (resp.status === 200) {
      showSuccessMessage(`Successfully added ${mentionIdsToSave.length} items`)
      onSuccess()
      closeDialog()
    } else {
      showErrorMessage(`Failed to import. ${save.message}`)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setDialogOpen(true)}
        startIcon={<PostAddIcon />}
      >
        Import
      </Button>
      {dialogOpen ?
        <Dialog
          fullScreen={smallScreen}
          // maxWidth={'lg'}
          open={dialogOpen}
          onClose={closeDialog}
          sx={{
            '.MuiPaper-root': {
              position: 'relative',
              // minWidth: '21rem',
              // maxWidth: 'calc(100% - 4rem)'
              // minWidth 40x16 = 640px
              minWidth: smallScreen ? 'auto' : '40rem',
              // maxHeight: smallScreen ? 'inherit':'60vh',
              height: smallScreen ? 'inherit' : '60vh'
            }
          }}
        >
          {searchResults !== null ?
            <ImportReportBody
              initialResults={searchResults}
              onCancel={closeDialog}
              onImport={importMentions}
            />
            :
            <DoiInputBody
              onCancel={closeDialog}
              onSubmit={(report) => setSearchResults(report)}
            />
          }
        </Dialog>
        : null
      }
    </>
  )
}
