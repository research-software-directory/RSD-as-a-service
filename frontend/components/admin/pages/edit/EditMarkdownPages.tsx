// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth/AuthProvider'
import {RsdLink} from '~/config/rsdSettingsReducer'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import AddPageModal from '../add/AddPageModal'
import {MarkdownPage} from '../useMarkdownPages'
import {deleteMarkdownPage, updatePagePositions} from '../saveMarkdownPage'
import {SubmitProps} from './EditMarkdownPage'
import PageEditorBody from './PageEditorBody'

export default function EditMarkdownPages({links}:Readonly<{links:RsdLink[]}>) {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const [navItems, setNavItems] = useState<RsdLink[]>(links)
  const [selected, setSelected] = useState<string>(links.length>0 ? links[0].slug : '')
  const [open, setOpen] = useState(false)
  const [delModal, setDelModal] = useState({open:false,slug:'',title:''})

  // console.group('EditMarkdownPages')
  // console.log('navItems...', navItems)
  // console.log('selected...', selected)
  // console.groupEnd()

  function showAddModal() {
    setOpen(true)
  }

  function closeAddModal() {
    setOpen(false)
  }

  function onAddPage(page: MarkdownPage) {
    // id is required
    if (!page.id) return
    const addLink:RsdLink = {
      id: page.id,
      position: page.position ?? navItems.length + 1,
      title: page.title ?? '',
      slug: page.slug ?? '',
      is_published: page.is_published ?? false
    }
    const newLinks = [
      ...navItems,
      addLink
    ]
    setNavItems(newLinks)
    // select new item
    setSelected(addLink.slug)
  }

  function onDeletePage(page: MarkdownPage) {
    if (page?.slug && page?.title) {
      // console.log('onDeletePage...',page)
      setDelModal({
        open: true,
        slug: page.slug,
        title: page.title
      })
    }
  }

  function updateSavedLink(data: {
    id:string,title:string,slug:string,is_published:boolean
  }) {
    // update information in the link array after page is saved
    const newLinks = navItems.map(item => {
      if (item.id === data.id) {
        return {
          ...item,
          ...data
        }
      }
      return item
    })
    setNavItems(newLinks)
  }

  function onSavePage({status, message, data}: SubmitProps) {
    if (status == 200) {
      updateSavedLink(data)
      // reset form status after save
      showSuccessMessage(message)
    } else {
      showErrorMessage(message)
    }
  }

  async function deletePage(slug: string) {
    closeDeleteModal()
    // console.log('delete page...', slug)
    const resp = await deleteMarkdownPage({slug, token})
    if (resp.status === 200) {
      const newLinks = navItems
        .filter(item => item.slug !== slug)
        // renumber
        .map((item, pos) => ({
          ...item,
          position: pos+1
        }))
      // save new collection
      setNavItems(newLinks)
      // select first item
      if (newLinks.length > 0) {
        setSelected(newLinks[0].slug)
        patchPositions(newLinks)
      }
    } else {
      showErrorMessage(`Failed to remove ${delModal.title}`)
    }
  }

  function closeDeleteModal() {
    setDelModal({
      open: false,
      slug: '',
      title: ''
    })
  }

  async function patchPositions(newList: RsdLink[]) {
    const orgItems = [
      ...navItems
    ]
    // update ui first
    setNavItems(newList)
    const resp = await updatePagePositions({
      items: newList,
      token
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to update page positions. ${resp?.message}`)
      // revert back
      setNavItems(orgItems)
    }
  }

  return (
    <>
      <section className={`mb-12 ${links.length>0 ? 'min-h-[60rem]':''}`}>
        <div className="flex pb-4 justify-end">
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={showAddModal}
          >
            Add
          </Button>
        </div>
        <PageEditorBody
          links={navItems}
          selected={selected}
          onSelect={(item) => setSelected(item.slug)}
          onSorted={patchPositions}
          onDelete={onDeletePage}
          onSubmit={onSavePage}
        />
      </section>
      <AddPageModal
        pos={navItems.length + 1}
        open={open}
        onCancel={closeAddModal}
        onSuccess={onAddPage}
      />
      <ConfirmDeleteModal
        title="Delete page"
        open={delModal.open}
        body={
          <p>Are you sure you want to remove <strong>{delModal.title ?? ''}</strong>?</p>
        }
        onCancel={closeDeleteModal}
        onDelete={()=>deletePage(delModal.slug)}
      />
    </>
  )
}
