// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useAuth} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {PageTitleSticky} from '~/components/layout/PageTitle'
import {RsdLink} from '~/config/rsdSettingsReducer'
import AddPageModal from '../add/AddPageModal'
import {MarkdownPage, useMarkdownPage} from '../useMarkdownPages'
import EditMarkdownPage, {SubmitProps} from './EditMarkdownPage'
import SortableNav from './SortableNav'
import {deleteMarkdownPage, updatePagePositions} from '../saveMarkdownPage'
import NoPageItems from './NoPageItems'
import logger from '~/utils/logger'

export default function EditMarkdownPages({links}:{links:RsdLink[]}) {
  const {session} = useAuth()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const [navItems, setNavItems] = useState<RsdLink[]>(links)
  const [selected, setSelected] = useState<string>(links.length>0 ? links[0].slug : '')
  const [open, setOpen] = useState(false)
  const [delModal, setDelModal] = useState({open:false,slug:'',title:''})
  const {loading, page} = useMarkdownPage({
    slug: selected,
    token: session.token,
    is_published: false
  })

  // console.group('EditMarkdownPages')
  // console.log('navItems...', navItems)
  // console.log('selected...', selected)
  // console.log('loading...', loading)
  // console.log('page...', page)
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
    const resp = await deleteMarkdownPage({slug, token: session.token})
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

  function renderEditMarkdown() {
    // loading
    if (loading) return <ContentLoader />
    if (navItems.length === 0) return <NoPageItems />
    return (
      <EditMarkdownPage
        page={page}
        token={session.token}
        onDelete={onDeletePage}
        onSubmit={onSavePage}
      />
    )
  }

  function onSorted(items: RsdLink[]) {
    const patchPosition = items.map(item => {
        return {
          id: item.id,
          slug: item.slug,
          position: item.position
        }
      })
    updatePagePositions({
        positions: patchPosition,
        token:session.token
      }).then(resp => {
        if (resp.status !== 200) {
          logger(`Failed to patch page positions. ${resp.status}: ${resp?.message}`)
        }
        setNavItems(items)
      }).catch((e: any) => {
        logger(`Failed to patch page positions. Error: ${e?.message}`)
      })
  }

  return (
    <>
      <PageTitleSticky
        style={{padding:'1rem 0rem 2rem 0rem'}}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="flex-1 w-full md:mt-4">Public pages</h1>
          <Button
            startIcon={<AddIcon />}
            onClick={showAddModal}
          >
            Add
          </Button>
        </div>
      </PageTitleSticky>

      <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
        <div>
          <SortableNav
            onSelect={(item)=>setSelected(item.slug)}
            selected={selected}
            links={navItems}
            onSorted={onSorted}
          />
        </div>
        <div>
          {renderEditMarkdown()}
        </div>
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
