// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import {useSession} from '~/auth'
import useSnackbar from '../../snackbar/useSnackbar'
import {
  columsForCreate, columsForUpdate, CoreOrganisationProps,
  EditOrganisation, Organisation, OrganisationForOverview
} from '../../../types/Organisation'
import {
  createOrganisation,
  newOrganisationProps,
  updateOrganisation
} from '../../../utils/editOrganisation'
import useOrganisationUnits from './useOrganisationUnits'
import {sortOnStrProp} from '../../../utils/sortFn'
import ResearchUnitList from './ResearchUnitList'
import ResearchUnitModal from './ResearchUnitModal'
import {upsertImage} from '~/utils/editImage'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import UserAgreementModal from '~/components/user/settings/UserAgreementModal'
import useOrganisationContext from '../context/useOrganisationContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'

type EditOrganisationModal = {
  open: boolean,
  pos?: number,
  organisation?: EditOrganisation
}

export default function ResearchUnits() {
  const {token, user} = useSession()
  const {id,primary_maintainer,isMaintainer} = useOrganisationContext()
  const {showErrorMessage} = useSnackbar()
  const {units, setUnits, count, loading} = useOrganisationUnits()
  const [modal, setModal] = useState<EditOrganisationModal>({
    open: false
  })
  const [isPrimary,setPrimary]=useState(primary_maintainer===user?.account)

  useEffect(() => {
    let abort = false
    if (primary_maintainer === user?.account ||
      user?.role === 'rsd_admin') {
      if (abort) return
      setPrimary(true)
    }
    return ()=>{abort=true}
  },[primary_maintainer,user?.account,user?.role])

  function renderAddBtn() {
    if (isPrimary) {
      return (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddUnit}
        >
          Add
        </Button>
      )
    }
    return null
  }

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

  function addUnitToCollection(unit:EditOrganisation) {
    const newUnits = [
      ...units,
      unit
    ].sort((a,b)=>sortOnStrProp(a,b,'name'))
    setUnits({
      // cast type for now and improve later
      data: newUnits as OrganisationForOverview[],
      count: newUnits.length
    })
  }

  function updateUnitInList(unit:EditOrganisation,pos:number) {
    const newList = [
      ...units.slice(0, pos),
      ...units.slice(pos+1),
      unit
    ].sort((a, b) => sortOnStrProp(a, b, 'name'))
    // debugger
    setUnits({
      // cast type for now and improve later
      data: newList as OrganisationForOverview[],
      count: newList.length
    })
  }

  async function saveOrganisation({data, pos}:{data: EditOrganisation, pos?: number }) {
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
      if (typeof pos != 'undefined' && data.id) {
        const unit:Organisation = getPropsFromObject(data,columsForUpdate)
        // update existing organisation
        const resp = await updateOrganisation({
          organisation: unit,
          token
        })
        // debugger
        if (resp.status !== 200) {
          showErrorMessage(resp.message)
        } else {
          updateUnitInList(data,pos)
          closeModals()
        }
      } else {
        // create new organisation
        const unit:CoreOrganisationProps = getPropsFromObject(data, columsForCreate)
        const resp = await createOrganisation({
          organisation:unit,
          token
        })
        // console.log('createOrganisation...resp...', resp)
        // debugger
        if (resp.status === 201) {
          data.id = resp.message
          addUnitToCollection(data)
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
    // TODO! missing primary maintainer!
    // console.log('ResearchUnits: TODO! on edit unit...', pos)
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
      className="flex-1 flex flex-col mb-12 p-4"
    >
      {/* Only when maintainer */}
      {isMaintainer && <UserAgreementModal />}
      <section className="flex justify-between py-4">
        <h2>Research Units ({count ?? 0})</h2>
        {renderAddBtn()}
      </section>
      <section>
        <ResearchUnitList
          loading={loading}
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
