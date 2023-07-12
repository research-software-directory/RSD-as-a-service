// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip'

import { useSession } from '~/auth'
import { softwareInformation as config } from '../editSoftwareConfig'
import { CategoriesForSoftware, CategoryID, CategoryPath, KeywordForSoftware } from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import { SelectedCategory, SoftwareCategories } from '../../SoftwareCategories'
import { addCategoryToSoftware, deleteCategoryToSoftware, getAvailableCategories } from '~/utils/getSoftware'

export type SoftwareCategoriesProps = {
  softwareId: string
  categories: CategoriesForSoftware
}

export default function AutosaveSoftwareCategories({ softwareId, categories: categoriesDefault }: SoftwareCategoriesProps) {
  const { token } = useSession()
  const { showErrorMessage, showInfoMessage } = useSnackbar()
  const [categories, setCategories] = useState(categoriesDefault)
  const [availableCategories, setAvailableCategories] = useState<CategoryPath[]>([])

  useEffect(() => {
    getAvailableCategories()
      .then(setAvailableCategories);
  }, [])

  // console.group('SoftwareCategories')
  // console.log('fields...', fields)
  // console.groupEnd()

  const onAdd = (category: SelectedCategory) => {
    console.log('onAdd:', softwareId, category.id)
    addCategoryToSoftware(softwareId, category.id, token).then(() => {
      // FIXME: should we expect that this is corrent or should we re-fetch the value from backend?
      setCategories([...categories, availableCategories[category.index]])
    }).catch((error) => {
      console.log(error)
      showErrorMessage(error.message)
    })
  }

  const onDelete = (category: SelectedCategory) => {
    console.log('onRemove:', softwareId, category.id)
    deleteCategoryToSoftware(softwareId, category.id, token).then(() => {
      // FIXME: should we expect that this is corrent or should we re-fetch the value from backend?
      setCategories(categories.filter((el, index) => index != category.index))
    }).catch((error) => {
      console.log(error)
      showErrorMessage(error.message)
    })
  }


  return (
    <>
      <EditSectionTitle
        title={config.categories.title}
        subtitle={config.categories.subtitle}
      />
      <div className="py-2">
        <div className="mt-1">Assigned:</div>
        <SoftwareCategories categories={categories} onClick={onDelete} />
        <div className="mt-1">Add more:</div>
        <SoftwareCategories categories={availableCategories} onClick={onAdd} />
      </div>
      {/*
      {keywords.map((item, pos) => {
        return(
          <div
            key={item.id}
            className="py-1 pr-1"
          >
            <Chip
              data-testid="keyword-chip"
              title={item.keyword}
              label={item.keyword}
              onDelete={() => onRemove(pos)}
              sx={{
                textTransform:'capitalize'
              }}
            />
          </div>
        )
      })}
      </div>
      <FindKeyword
        config={{
          freeSolo: false,
          minLength: config.keywords.validation.minLength,
          label: config.keywords.label,
          help: config.keywords.help,
          reset: true
        }}
        searchForKeyword={searchForSoftwareKeyword}
        onAdd={onAdd}
        onCreate={onCreate}
      />
      {
        concept_doi &&
        <div className="pt-4 pb-0">
          <ImportKeywordsFromDoi
            software_id={software_id}
            concept_doi={concept_doi}
            keywords={keywords}
            onSetKeywords={setKeywords}
          />
        </div>
      }
    */}
    </>
  )
}
