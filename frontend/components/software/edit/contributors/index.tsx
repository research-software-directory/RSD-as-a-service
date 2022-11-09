// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {Contributor, ContributorProps, SaveContributor} from '~/types/Contributor'
import {
  deleteContributorsById, patchContributor,
  patchContributorPositions, postContributor,
} from '~/utils/editContributors'
import {getDisplayName} from '~/utils/getDisplayName'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import EditContributorModal from './EditContributorModal'
import FindContributor, {Name} from './FindContributor'
import EditSoftwareSection from '../../../layout/EditSection'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import {contributorInformation as config} from '../editSoftwareConfig'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import GetContributorsFromDoi from './GetContributorsFromDoi'
import useSoftwareContext from '../useSoftwareContext'
import useSoftwareContributors from './useSoftwareContributors'
import SortableContributorsList from './SortableContributorsList'
import {deleteImage, upsertImage} from '~/utils/editImage'

type EditContributorModal = ModalProps & {
  contributor?: Contributor
}

export default function SoftwareContributors() {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading,contributors,setContributors} = useSoftwareContributors()
  const [modal, setModal] = useState<ModalStates<EditContributorModal>>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  function hideModals() {
    // hide modals
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
  }

  function updateContributorList({data, pos}: { data: Contributor, pos?: number }) {
    if (typeof pos === 'number') {
      // REPLACE existing item and sort
      const list = contributors.map((item, i) => {
        // replace item at pos
        if (i === pos) return data
        return item
      })
      // pass new list with addition contributor
      setContributors(list)
    } else {
      // ADD item and sort
      const list = [
        ...contributors,
        data
      ]
      setContributors(list)
    }
  }

  function loadContributorIntoModal(contributor: Contributor,pos?:number) {
    if (contributor) {
      // show modal and pass data
      setModal({
        edit: {
          open: true,
          pos,
          contributor
        },
        delete: {
          open: false
        }
      })
    }
  }

  function onEditContributor(pos:number) {
    // select contributor
    const contributor = contributors[pos]
    loadContributorIntoModal(contributor,pos)
  }

  async function onSubmitContributor({data, pos}:{data:Contributor,pos?: number}) {
     // UPLOAD avatar
    if (data.avatar_b64 && data.avatar_mime_type) {
      // split base64 to use only encoded content
      const b64data = data.avatar_b64.split(',')[1]
      const upload = await upsertImage({
        data: b64data,
        mime_type: data.avatar_mime_type,
        token
      })
      // debugger
      if (upload.status === 201) {
        // update data values
        data.avatar_id = upload.message
      } else {
        showErrorMessage(`Failed to upload image. ${upload.message}`)
        return
      }
    }
    // ensure software id
    if (!data.software && software.id) {
      data.software = software.id
    }
    // prepare member object for save (remove helper props)
    const contributor:SaveContributor = getPropsFromObject(data, ContributorProps)
    // if id present we update
    if (contributor?.id && typeof pos !== 'undefined') {
      const resp = await patchContributor({
        contributor,
        token
      })
      if (resp.status === 200) {
        updateContributorList({data:contributor,pos})
        hideModals()
      } else {
        showErrorMessage(`Failed to update ${getDisplayName(data)}. Error: ${resp.message}`)
      }
    } else {
      // this is completely new contributor we need to add to DB
      contributor.position = contributors.length + 1
      const resp = await postContributor({
        contributor,
        token
      })
      if (resp.status === 201) {
        // id of created record is provided in returned in message
        contributor.id = resp.message
        // update contributors list
        updateContributorList({data: contributor})
        hideModals()
      } else {
        showErrorMessage(`Failed to add ${getDisplayName(contributor)}. Error: ${resp.message}`)
      }
    }
  }

  function onDeleteContributor(pos:number) {
    const displayName = getDisplayName(contributors[pos]) ?? ''
    setModal({
      edit: {
        open: false
      },
      delete: {
        open: true,
        pos,
        displayName
      }
    })
  }

  async function deleteContributor(pos?: number) {
    // hide modals
    hideModals()
    // abort if not specified
    if (typeof pos == 'number') {
      const contributor = contributors[pos]
      // existing contributor
      if (contributor.id) {
        // remove from database
        const ids = [contributor.id]
        const resp = await deleteContributorsById({ids, token})
        if (resp.status === 200) {
          // show notification
          // showSuccessMessage(`Removed ${getDisplayName(contributor)} from ${pageState.software.brand_name}`)
          removeFromContributorList(pos)
        } else {
          showErrorMessage(`Failed to remove ${getDisplayName(contributor)}. Error: ${resp.message}`)
        }
        // try to remove member avatar
        // without waiting for result
        if (contributor.avatar_id) {
          const del = await deleteImage({
            id: contributor.avatar_id,
            token
          })
        }
      } else {
        // new contributor
        removeFromContributorList(pos)
      }
    }
  }

  function removeFromContributorList(pos: number) {
    // remove item from contributors list
    const list = [
      ...contributors.slice(0, pos),
      ...contributors.slice(pos+1)
    ].map((item, pos) => {
      // renumber positions
      item.position = pos + 1
      return item
    })
    sortedContributors(list)
  }

  async function sortedContributors(contributors: Contributor[]) {
    if (contributors.length > 0) {
      const resp = await patchContributorPositions({
        contributors,
        token
      })
      if (resp.status === 200) {
        setContributors(contributors)
      } else {
        showErrorMessage(`Failed to update contributor positions. ${resp.message}`)
      }
    } else {
      setContributors(contributors)
    }
  }

  return (
    <>
      <EditSoftwareSection className='md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>Contributors</span>
            <span>{contributors?.length}</span>
          </h2>
          <SortableContributorsList
            contributors={contributors}
            onEdit={onEditContributor}
            onDelete={onDeleteContributor}
            onSorted={sortedContributors}
          />
        </section>
        <section className="py-4">
          <EditSectionTitle
            title={config.findContributor.title}
            subtitle={config.findContributor.subtitle}
          />
          <FindContributor
            software={software?.id ?? ''}
            onAdd={loadContributorIntoModal}
          />
          {
            software?.concept_doi &&
            <div className="pt-8 pb-0">
              <EditSectionTitle
                title={config.importContributors.title}
                subtitle={config.importContributors.subtitle}
              />
              <GetContributorsFromDoi
                contributors={contributors}
                onSetContributors={setContributors}
              />
            </div>
          }
        </section>
      </EditSoftwareSection>
      <EditContributorModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        contributor={modal.edit.contributor}
        onCancel={() => {
          setModal({
            edit:{open:false},
            delete:{open:false}
          })
        }}
        onSubmit={onSubmitContributor}
      />
      <ConfirmDeleteModal
        open={modal.delete.open}
        title="Remove contributor"
        body={
          <p>Are you sure you want to remove <strong>{modal.delete.displayName ?? 'No name'}</strong>?</p>
        }
        onCancel={() => {
          setModal({
            edit:{open:false},
            delete:{open:false}
          })
        }}
        onDelete={()=>deleteContributor(modal.delete.pos)}
      />
    </>
  )
}
