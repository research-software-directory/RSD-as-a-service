// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {EditProject} from '~/types/Project'
import {ProjectImageInfo} from './index'

type ProjectImageChanges = {
  formData: EditProject,
  projectState?: EditProject
}

export function getProjectImageChanges(props: ProjectImageChanges) {
  const {formData, projectState} = props
  //project image "actions", inital values
  const projectImage: ProjectImageInfo = {
    action: 'none',
    id: formData.id,
    image_b64: null,
    image_mime_type: null
  }
  if (
    // if we have image_b64 data and mime_type
    // user uploaded new image
    formData.image_b64 &&
    formData.image_mime_type
  ) {
    // split base64 to use only encoded content
    projectImage.image_b64 = formData.image_b64.split(',')[1]
    projectImage.image_mime_type = formData.image_mime_type
    if (
      // if we have image_id previously then an image
      // was already uploaded and we should update image
      projectState?.image_id &&
      projectState.image_id !== null) {
      projectImage.action = 'update'
    } else {
      // otherwise new image should be added
      projectImage.action = 'add'
    }
  } else if (
    // if project object has image_id and the form data
    // doesn't then we need to delete image from db
    projectState?.image_id !== null &&
    formData.image_id == null
  ) {
    projectImage.action = 'delete'
  }

  return projectImage
}
