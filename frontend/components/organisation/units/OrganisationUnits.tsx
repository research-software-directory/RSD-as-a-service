// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import {useSession} from '~/auth/AuthProvider'
import {upsertImage} from '~/utils/editImage'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {
  createOrganisation,
  newOrganisationProps,
  updateOrganisation
} from '~/components/organisation/apiEditOrganisation'
import {
  colForCreate,
  colForUpdate,
  CoreOrganisationProps,
  EditOrganisation,
  Organisation,
  OrganisationUnitsForOverview
} from '~/types/Organisation'
import useSnackbar from '~/components/snackbar/useSnackbar'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import ResearchUnitList from './ResearchUnitList'
import ResearchUnitModal from './ResearchUnitModal'

type EditOrganisationModal = {
  open: boolean,
  pos?: number,
  organisation?: EditOrganisation
}

type ResearchUnitsProps = {
  units: OrganisationUnitsForOverview[]
}

export default function OrganisationUnits({units}: Readonly<ResearchUnitsProps>) {
  const router = useRouter()
  const {token, user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {id,primary_maintainer,children_cnt,updateOrganisationContext} = useOrganisationContext()
  const [modal, setModal] = useState<EditOrganisationModal>({
    open: false
  })
  const [isPrimary,setIsPrimary]=useState(false)

  useEffect(() => {
    let abort = false
    if (primary_maintainer === user?.account ||
      user?.role === 'rsd_admin') {
      if (abort) return
      setIsPrimary(true)
    }
    return ()=>{abort=true}
  },[primary_maintainer,user?.account,user?.role])

  /**
   * Sync children_cnt in the context after adding new unit
   * This info is used in the Tab
   */
  useEffect(()=>{
    let abort = false
    if (children_cnt !== units?.length && abort===false){
      updateOrganisationContext({
        key:'children_cnt',
        value: units?.length
      })
    }
    return ()=>{abort=true}
  // ignore updateOrganisationContext to avoid circular renders!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[units?.length,children_cnt])

  function onAddUnit() {
    if (id) {
      const newOrganisation:EditOrganisation = newOrganisationProps({
        name:'',
        position: 1,
        // the primary_maintainer of parent is also
        // primary_maintainer of child organisations
        primary_maintainer: primary_maintainer ?? '',
        parent: id
      })
      // show modal
      setModal({
        open: true,
        organisation: newOrganisation
      })
    }
  }

  function closeModals() {
    setModal({
      open: false
    })
  }

  async function saveOrganisation({data, pos}:{data: EditOrganisation, pos?: number}) {
    try {
      // console.log('saveOrganisation...', data)
      // UPLOAD logo
      if (data.logo_b64 && data.logo_mime_type) {
        // split base64 to use only encoded content
        const b64data = data.logo_b64.split(',')[1]
        const upload = await upsertImage({
          data: b64data,
          mime_type: data.logo_mime_type,
          token
        })
        // debugger
        if (upload.status === 201) {
          // update data values
          data.logo_id = upload.message
          // remove image strings after upload
          data.logo_b64 = null
          data.logo_mime_type = null
        } else {
          showErrorMessage(`Failed to upload image. ${upload.message}`)
          return
        }
      }
      // SAVE organisation
      if (pos !== undefined && data.id) {
        const unit:Organisation = getPropsFromObject(data,colForUpdate)
        // update existing organisation
        const resp = await updateOrganisation({
          organisation: unit,
          token
        })
        // debugger
        if (resp.status === 200) {
          // reload page
          router.refresh()
          closeModals()
        } else {
          showErrorMessage(resp.message)
        }
      } else {
        // create new organisation
        const unit:CoreOrganisationProps = getPropsFromObject(data, colForCreate)
        const resp = await createOrganisation({
          organisation:unit,
          token
        })
        // console.log('createOrganisation...resp...', resp)
        // debugger
        if (resp.status === 201) {
          // reload page
          router.refresh()
          closeModals()
        } else {
          showErrorMessage(resp.message)
        }
      }
    } catch (e:any) {
      showErrorMessage(e.message)
    }
  }

  function onEditUnit(pos: number) {
    const unit = units[pos]
    if (unit) {
      // convert to EditOrganisation
      const editOrganisation: EditOrganisation = {
        ...unit,
        position: pos,
        logo_b64: null,
        logo_mime_type: null,
        // it is already in RSD
        source: 'RSD'
      }
      setModal({
        open: true,
        organisation:editOrganisation,
        pos
      })
    }
  }

  return (
    <BaseSurfaceRounded
      className="flex-1 flex flex-col mb-12 py-4 px-8"
    >
      {/* Only primary maintainer can create/edit units */}
      {isPrimary && <UserAgreementModal />}
      <section className="flex justify-between py-4">
        <h2>Research Units ({units.length})</h2>
        {isPrimary ?
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddUnit}
          >
            Add
          </Button>
          : null
        }
      </section>
      <section>
        <ResearchUnitList
          units={units}
          isPrimaryMaintainer={isPrimary}
          onEdit={onEditUnit}
        />
      </section>
      <ResearchUnitModal
        title="Research unit"
        open={modal.open}
        pos={modal.pos}
        organisation={modal.organisation}
        onCancel={closeModals}
        onSubmit={saveOrganisation}
      />
    </BaseSurfaceRounded>
  )
}
