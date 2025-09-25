// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import List from '@mui/material/List'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Switch from '@mui/material/Switch'
import PostAddIcon from '@mui/icons-material/PostAdd'

import {SearchResult} from './index'
import {DoiBulkImportReport} from './apiImportMentions'
import ImportDialogTitle from './ImportDialogTitle'
import ImportDialogActions from './ImportDialogActions'
import SanitizedMathMLBox from '~/components/layout/SanitizedMathMLBox'

type BulkImportReportBodyProps = {
  initialResults: DoiBulkImportReport
  onCancel: () => void
  onImport: (searchResults:SearchResult[]) => void
}

export default function ImportReportBody({initialResults,onCancel,onImport}: BulkImportReportBodyProps) {
  const [validCnt, setValidCnt] = useState(0)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // console.group('BuilkImportReportBody')
  // console.log('initialResults...', initialResults)
  // console.log('validCnt...', validCnt)
  // console.groupEnd()

  useEffect(() => {
    let validItems = 0
    const results:SearchResult[] = []
    if (initialResults) {
      // convert Map to array of results
      initialResults.forEach((result) => {
        // console.log('result...', result)
        // console.log('key...', key)
        if (result?.status === 'valid' && result?.include === true) validItems++
        results.push(result)
      })
    }
    // debugger
    setValidCnt(validItems)
    setSearchResults(results)
  }, [initialResults])

  function toggleSelection(index:number) {
    // copy array
    const newList = [
      ...searchResults
    ]
    // toggle value
    newList[index].include = !newList[index].include
    let validItems = 0
    if (newList) {
      newList.forEach((result) => {
        if (result?.status === 'valid' &&
          result?.include === true) {
          validItems++
        }
      })
    }
    // debugger
    setValidCnt(validItems)
    // save new values
    setSearchResults(newList)
  }

  function generateErrorMessage(result: SearchResult){
    switch (result.status) {
      case 'invalidDoi':
        return 'Not a valid DOI'
      case 'doiNotFound':
        return 'DOI not found'
      case 'alreadyImported':
        return 'This publication is already imported'
      default:
        return 'Unknown error'
    }
  }

  function startImport() {
    // select items with include flag and mention item
    const selection = searchResults
      .filter(result => result.include && result.mention)
    // pass selection to parent
    onImport(selection)
  }

  function renderListItems() {
    const html: any[] = []
    // nothing to report
    if (searchResults === null) return html
    // render report
    searchResults.forEach((result,index) => {
      // console.log('result...', result)
      // console.log('key...', key)
      html.push(
        <ListItem
          data-testid="import-mention-report-item"
          key={result.doi}
          secondaryAction={
            <Switch
              data-testid="switch-toggle-button"
              disabled={result?.status !== 'valid'}
              checked={result.include}
              onChange={()=>toggleSelection(index)}
            />
          }
          sx={{
            paddingRight: '5rem',
            '&:hover': {
              backgroundColor: 'grey.100'
            },
          }}
        >
          <ListItemText
            primary={
              result?.mention ?
                <a href={`https://doi.org/${result.mention.doi}`} target="_blank">
                  {result.mention.doi}
                </a>
                : <span>{result.doi}</span>
            }
            secondary={
              result?.mention ?
                <>
                  <SanitizedMathMLBox
                    title={result?.mention.title}
                    component="span"
                    className="text-secondary"
                    rawHtml={result?.mention.title}
                  /><br />
                  <span>{result.mention.authors}</span><br />
                  <span>Source: {result.source}</span>
                </>
                : <span className="text-error">{generateErrorMessage(result)}</span>
            }
          />
        </ListItem>
      )
    })
    // debugger
    return html
  }

  return (
    <>
      <ImportDialogTitle
        title={`Selection report (${validCnt} of ${searchResults?.length ?? 0} items)`}
      />
      <DialogContent>
        <List>
          {renderListItems()}
        </List>
      </DialogContent>
      <ImportDialogActions>
        <Button
          tabIndex={1}
          onClick={onCancel}
          color="secondary"
          sx={{marginRight:'2rem'}}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          endIcon={<PostAddIcon />}
          tabIndex={0}
          disabled={validCnt===0}
          onClick={startImport}
        >
          Import
        </Button>
      </ImportDialogActions>
    </>
  )
}
