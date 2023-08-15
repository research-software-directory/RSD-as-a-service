// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'
import {EditSoftwareItem} from '~/types/SoftwareTypes'

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {softwareInformation as config} from '../editSoftwareConfig'
import AutosaveConceptDoi from './AutosaveConceptDoi'
import AutosaveSoftwareTextField from './AutosaveSoftwareTextField'
import AutosaveSoftwarePageStatus from './AutosaveSoftwarePageStatus'
import AutosaveSoftwareKeywords from './AutosaveSoftwareKeywords'
import AutosaveRepositoryUrl from './AutosaveRepositoryUrl'
import AutosaveSoftwareLicenses from './AutosaveSoftwareLicenses'
import AutosaveSoftwareMarkdown from './AutosaveSoftwareMarkdown'
import AutosaveSoftwareLogo from './AutosaveSoftwareLogo'
import AutosaveSoftwareSwitch from './AutosaveSoftwareSwitch'
import {addLicensesForSoftware, deleteLicense} from '~/utils/editSoftware'
import {getLicenseForSoftware} from '~/utils/getSoftware'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {License} from '~/types/SoftwareTypes'
import {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'

type SoftwareInformationFormProviderProps = {
  editSoftware: EditSoftwareItem
}

export default function SoftwareInformationForm({editSoftware}: SoftwareInformationFormProviderProps) {
  const {user, token} = useSession()
  const methods = useForm<EditSoftwareItem>({
    mode: 'onChange',
    defaultValues: {
      ...editSoftware
    }
  })
  const {
    register, watch, formState
  } = methods
  // destructure formState (subscribe to changes)
  const {dirtyFields} = formState
  // watch form data changes (we use reset in useEffect)
  const formData = watch()
  const {showErrorMessage} = useSnackbar()

  console.group('SoftwareInformationForm')
  console.log('editSoftware...', editSoftware)
  console.log('formData...', formData)
  console.log('dirtyFields...', dirtyFields)
  console.groupEnd()

  let repoURL, citationField, licensesField
  repoURL = citationField = licensesField = <></>

  if (formData.closed_source){
    repoURL = citationField = licensesField = <></>
    closedSourceLicense()
  }
  else {
    repoURL = <AutosaveRepositoryUrl />
    citationField = <AutosaveConceptDoi />
    licensesField = <AutosaveSoftwareLicenses
      items={formData.licenses}
      concept_doi={formData.concept_doi ?? undefined}
    />
    openSourceLicense()
  }

  async function closedSourceLicense() {
    let resp = await getLicenses()
    console.log("closedSourceLicense_resp:")
    console.log(resp)
    if (!(resp.length === 1 && resp[0].license === "Proprietary")) {
      console.log("CLOSED")
      await removeAllLicenses(resp, token)
      await addClosedSourceLicense(formData.id, token)
      resp = await getLicenses()
      console.log(resp)
    }
  }

  async function openSourceLicense() {
    const resp = await getLicenses()
    console.log("openSourceLicense_resp:")
    console.log(resp)
    if (resp.length === 1 && resp[0].license === "Proprietary") {
      console.log("OPEN")
      removeAllLicenses(resp, token)
    }
  }

  async function getLicenses() {
    const resp = await getLicenseForSoftware(formData.id, true, token)
    console.log("getLicenses_resp:")
    console.log(resp)
    if (!resp) {
      showErrorMessage(`Failed to get licenses.`)
    }
    else {
      return resp
    }
  }

  async function addClosedSourceLicense(software: string, token: string) {
    console.log("POSTing")
    const resp = await addLicensesForSoftware({
      software: software,
      license: "Proprietary",
      token: token,
    })
    if (resp.status !== 201) {
      showErrorMessage(`Failed to add Proprietary license. ${resp.message}`)
    }
  }

  async function removeAllLicenses(licenses: License[], token: string) {
    console.log("Removing")
    for (let i=0;i<licenses.length;i++) {
      const resp = await deleteLicense({
        id: String(licenses[i].id),
        token: token,
      })
      console.log("loop",i,resp)
      if (resp.status !== 200) {
        showErrorMessage(`Failed to remove license. ${resp.message}`)
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        data-testid="software-information-form"
        id="software-information"
        // onSubmit={handleSubmit(onSubmit)}
        className='flex-1'>
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id', {required:'id is required'})}
        />
        <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
          <div className="py-4 overflow-hidden">
            <EditSectionTitle
              title="Software information"
            />
            {user?.role === 'rsd_admin' ?
              <>
                <div className="py-2"></div>
                <AutosaveSoftwareTextField
                  software_id={formData.id}
                  options={{
                    name: 'slug',
                    label: config.slug.label,
                    useNull: true,
                    defaultValue: editSoftware?.slug,
                    helperTextMessage: config.slug.help,
                    helperTextCnt: `${editSoftware?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
                  }}
                  rules={config.slug.validation}
                />
              </>
              :
              <input type="hidden"
                {...register('slug', {required:'slug is required'})}
              />
            }
            <div className="py-2"></div>
            <AutosaveSoftwareTextField
              software_id={formData.id}
              options={{
                name: 'brand_name',
                label: config.brand_name.label,
                useNull: true,
                defaultValue: editSoftware?.brand_name,
                helperTextMessage: config.brand_name.help,
                helperTextCnt: `${formData?.brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`,
              }}
              rules={config.brand_name.validation}
            />
            <div className="py-2"></div>
            <AutosaveSoftwareTextField
              software_id={formData.id}
              options={{
                name: 'short_statement',
                label: config.short_statement.label,
                multiline: true,
                maxRows: 5,
                useNull: true,
                defaultValue: editSoftware?.short_statement,
                helperTextMessage: config.short_statement.help,
                helperTextCnt: `${formData?.short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`,
              }}
              rules={config.short_statement.validation}
            />
            <div className="py-2"></div>
            <AutosaveSoftwareSwitch
              software_id={formData.id}
              name='closed_source'
              label={config.closed_source.label}
              defaultValue={editSoftware.closed_source}
            />
            <EditSectionTitle
              title='Software URLs'
              subtitle='Where can users find information to start?'
            />
            <AutosaveSoftwareTextField
              software_id={formData.id}
              options={{
                name: 'get_started_url',
                label: config.get_started_url.label,
                useNull: true,
                defaultValue: editSoftware?.get_started_url,
                helperTextMessage: config.get_started_url.help,
                helperTextCnt: `${formData?.get_started_url?.length || 0}/${config.get_started_url.validation.maxLength.value}`,
              }}
              rules={config.get_started_url.validation}
            />
            <div className="py-2"></div>
            {repoURL}
            <div className="py-2"></div>
            <AutosaveSoftwareMarkdown />
            {/* add white space at the bottom */}
            <div className="xl:py-4"></div>
          </div>
          <div className="py-4 min-w-[21rem] xl:my-0">
            <AutosaveSoftwarePageStatus />
            <div className="py-4"></div>
            {citationField}
            <div className="py-4"></div>
            <AutosaveSoftwareLogo />
            <div className="py-4"></div>
            <AutosaveSoftwareKeywords
              software_id={formData.id}
              concept_doi={formData.concept_doi ?? undefined}
              items={formData.keywords ?? []}
            />
            <div className="py-4"></div>
            {licensesField}
            {/* add white space at the bottom */}
            <div className="py-4"></div>
          </div>
        </EditSection>
      </form>
    </FormProvider>
  )
}
