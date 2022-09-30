// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Button from '@mui/material/Button'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {ProjectLink} from '~/types/Project'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {deleteProjectLink, patchProjectLinkPositions} from '~/utils/editProject'
import {projectInformation as config} from './config'
import ProjectLinkModal from './ProjectLinkModal'
import SortableProjectLinksList from './SortableProjectLinksList'

type ProjectLinksProps = {
  project_id: string,
  url_for_project: ProjectLink[]
}

type ModalState = {
  open: boolean,
  item?: ProjectLink,
  pos?: number
}

export default function AutosaveProjectLinks({project_id, url_for_project}: ProjectLinksProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [links, setLinks] = useState(url_for_project)
  const [modal, setModal] = useState<ModalState>({
    open: false
  })

  function addLink() {
    const newLink = {
      id: null,
      position: links.length + 1,
      title: null,
      url: null,
      project: project_id
    }
    setModal({
      open: true,
      item: newLink
    })
  }

  function editLink(pos: number) {
    const item = links[pos]
    if (item) {
      setModal({
        open: true,
        item,
        pos
      })
    }
  }

  async function deleteLink(pos: number) {
    // console.log('delete link...', pos)
    const item = links[pos]
    if (item.id) {
      const resp = await deleteProjectLink({
        id: item.id,
        token
      })
      if (resp.status === 200) {
        const items = [
          // remove item
          ...links.slice(0, pos),
          ...links.slice(pos+1)
        ].map((item, pos) => {
          // renumber positions
          item.position = pos + 1
          return item
        })
        // update links positions
        sortedLinks(items)
      } else {
        showErrorMessage(`Failed to remove link. ${resp.message}`)
      }
    }
  }

  async function sortedLinks(links: ProjectLink[]) {
    // patch only if there are items left
    if (links.length > 0) {
      const resp = await patchProjectLinkPositions({
        links,
        token
      })
      if (resp.status === 200) {
        setLinks(links)
      } else {
        showErrorMessage(`Failed to update project link positions. ${resp.message}`)
      }
    } else {
      setLinks(links)
    }
  }

  function updateLink({data, pos}: { data: ProjectLink, pos?: number }) {
    if (typeof pos !== 'undefined') {
      const items = links.map((item, i) => {
        // return updated item
        if (i === pos) return data
        return item
      })
      setLinks(items)
    } else {
      const items = [
        ...links,
        data
      ]
      setLinks(items)
    }
    setModal({
      open:false
    })
  }

  return (
    <>
      <EditSectionTitle
        title={config.url_for_project.sectionTitle}
        subtitle={config.url_for_project.sectionSubtitle}
      >
        <Button
          onClick={addLink}
          sx={{margin:'0rem 0rem 0.5rem 1rem'}}
        >
          Add
        </Button>
      </EditSectionTitle>

      <section>
        <SortableProjectLinksList
          links={links}
          onEdit={editLink}
          onDelete={deleteLink}
          onSorted={sortedLinks}
        />
      </section>

      <ProjectLinkModal
        pos={modal.pos}
        open={modal.open}
        url_for_project={modal?.item}
        onCancel={() => setModal({open: false})}
        onSubmit={updateLink}
      />
    </>
  )
}
