// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext,useEffect,useState} from 'react'

import {app} from '~/config/app'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ContentLoader from '~/components/layout/ContentLoader'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {Contributor, ContributorProps} from '~/types/Contributor'
import {
  addContributorToDb, deleteContributorsById,
  getAvatarUrl, getContributorsForSoftware,
  prepareContributorData, updateContributorInDb
} from '~/utils/editContributors'
import useOnUnsaveChange from '~/utils/useOnUnsavedChange'
import {getDisplayName} from '~/utils/getDisplayName'
import {sortOnStrProp} from '~/utils/sortFn'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {getContributorsFromDoi} from '~/utils/getInfoFromDatacite'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'
import EditContributorModal from './EditContributorModal'
import FindContributor, {Name} from './FindContributor'
import SoftwareContributorsList from './SoftwareContributorsList'
import EditSoftwareSection from '../../../layout/EditSection'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import {contributorInformation as config} from '../editSoftwareConfig'
import {ModalProps, ModalStates} from '../editSoftwareTypes'
import GetContributorsFromDoi from './GetContributorsFromDoi'
import useSoftwareContext from '../useSoftwareContext'
import useSoftwareContributors from './useSoftwareContributors'

type EditContributorModal = ModalProps & {
  contributor?: Contributor
}

export default function SoftwareContributors({slug}: { slug: string }) {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage,showInfoMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading,contributors,setContributors, setLoading} = useSoftwareContributors()
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

  function updateContributorList({data, pos}: { data: Contributor, pos?: number }) {
    if (typeof pos == 'number') {
      // REPLACE existing item and sort
      const list = [
        ...contributors.slice(0, pos),
        data,
        ...contributors.slice(pos+1)
      ].sort((a,b)=>sortOnStrProp(a,b,'given_names'))
      // pass new list with addition contributor
      setContributors(list)
    } else {
      // ADD item and sort
      const list = [
        ...contributors,
        data
      ].sort((a,b)=>sortOnStrProp(a,b,'given_names'))
      setContributors(list)
    }
  }

  function onCreateNewContributor(name:Name) {
    const newContributor: Contributor = getPropsFromObject(name, ContributorProps)
    // set defaults
    newContributor.software = software?.id ?? ''
    newContributor.is_contact_person = false
    loadContributorIntoModal(newContributor)
  }

  async function onAddContributor(item: Contributor) {
    // update software id if missing
    if (item.software === '' &&
      software?.id &&
      software?.id !== '') {
      item.software = software?.id
    }
    loadContributorIntoModal(item)
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
    setModal({
      edit: {
        open: false
      },
      delete: {
        open: false
      }
    })
    // if id present we update
    if (data?.id) {
      const resp = await updateContributorInDb({data, token})
      if (resp.status === 200) {
        updateContributorList({data: resp.message,pos})
        // show notification
        showSuccessMessage(`Updated ${getDisplayName(data)}`)
      } else {
        showErrorMessage(`Failed to update ${getDisplayName(data)}. Error: ${resp.message}`)
      }
    } else {
      // this is completely new contributor we need to add to DB
      const contributor = prepareContributorData(data)
      const resp = await addContributorToDb({contributor, token})

      if (resp.status === 201) {
        // id of created record is provided in returned in message
        contributor.id = resp.message
        // remove avatar data
        contributor.avatar_data = null
        // construct url
        contributor.avatar_url = getAvatarUrl(contributor)
        // update contributors list
        updateContributorList({data: contributor})
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
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
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
    ]
    setContributors(list)
  }

  async function onGetContributorsFromDoi() {
    setLoading(true)

    const contribDoi: Contributor[] = await getContributorsFromDoi(
      software?.id ?? '', software?.concept_doi ?? ''
    )

    if (!contribDoi || contribDoi.length === 0) {
      showErrorMessage(
        `Contributors could not be added from DOI ${software?.concept_doi}`
      )
      setLoading(false)
      return
    }

    // extract only new Contributors
    // for now using only family names as key
    // TODO!
    // extend itemsNotInReferenceList to use combination of props (first_name + last_name)
    // and not to be case sensitive?
    const newContributors = itemsNotInReferenceList({
      list: contribDoi,
      referenceList: contributors,
      key: 'family_names'
    })

    if (newContributors.length === 0) {
      showInfoMessage(
        `No new contributors to add from DOI ${software?.concept_doi} based on family_names.`
      )
      setLoading(false)
      return
    }

    for (const c of newContributors) {
      const contributor = prepareContributorData(c)
      const resp = await addContributorToDb({contributor, token})

      if (resp.status === 201) {
        // update item in newContributors
        c.id = resp.message
        // no image provided by datacite
        c.avatar_data = null
        c.avatar_url = null
      } else {
        showErrorMessage(
          `Failed to add ${getDisplayName(contributor)}. Error: ${resp.message}`
        )
      }
    }

    const list = [
      ...contributors,
      ...newContributors
    ].sort((a, b) => sortOnStrProp(a, b, 'given_names'))
    setContributors(list)

    setLoading(false)
  }

  return (
    <>
      <EditSoftwareSection className='md:flex md:flex-col-reverse md:justify-end xl:pl-[3rem] xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>Contributors</span>
            <span>{contributors?.length}</span>
          </h2>
          <SoftwareContributorsList
            contributors={contributors}
            onEdit={onEditContributor}
            onDelete={onDeleteContributor}
          />
        </section>
        <section className="py-4">
          <EditSectionTitle
            title={config.findContributor.title}
            subtitle={config.findContributor.subtitle}
          />
          <FindContributor
            onAdd={onAddContributor}
            onCreate={onCreateNewContributor}
          />
          {
            software?.concept_doi &&
            <div className="pt-8 pb-0">
              <EditSectionTitle
                title={config.importContributors.title}
                subtitle={config.importContributors.subtitle}
              />
              <GetContributorsFromDoi
                onClick={onGetContributorsFromDoi}
                title={config.importContributors.message(software?.concept_doi)}
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
