
import {
  NewSoftwareItem,
  Tag,
  EditSoftwareItem,
  License
} from '../../types/SoftwareTypes'

import {AutocompleteOption} from '../../types/AutocompleteOptions'

export async function addSoftware({software, token}:
  { software: NewSoftwareItem, token: string }) {
  // console.log('Mocked addSoftware...')
  return {
    status: 201,
    message: {
      software,
      token
    }
  }
}

export async function getSoftwareToEdit({slug, token, baseUrl}:
  { slug: string, token: string, baseUrl?: string }) {
  return {
    status: 200,
    message: {
      slug,
      token,
      baseUrl
    }
  }
}

export async function updateSoftwareInfo({software, tagsInDb, licensesInDb, repositoryInDb, token}:{
  software: EditSoftwareItem, tagsInDb: AutocompleteOption<Tag>[], licensesInDb: AutocompleteOption<License>[],
  repositoryInDb: string|null, token: string
}) {
  try {
    return {
      status: 200,
      message: software
    }
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}
