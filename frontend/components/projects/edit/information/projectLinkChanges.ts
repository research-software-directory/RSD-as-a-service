import {UseFieldArrayUpdate, UseFormGetFieldState, UseFormGetValues} from 'react-hook-form'
import {EditProject, ProjectLink, ProjectLinkInForm} from '~/types/Project'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

export type ProjectLinksForSave = {
  add: ProjectLink[]
  update: ProjectLink[]
  delete: string[],
  updateUrl: UseFieldArrayUpdate<EditProject, 'url_for_project'>
}

type ProjectLinkChangesProps = {
  updateUrl: UseFieldArrayUpdate<EditProject, 'url_for_project'>,
  formData: EditProject,
  getValues: UseFormGetValues<EditProject>,
  getFieldState: UseFormGetFieldState<EditProject>,
  projectState?: EditProject
}

export function getProjectLinkChanges(props: ProjectLinkChangesProps) {
  // destructure
  const {updateUrl,formData,getValues,getFieldState,projectState} = props
  // get project url states, what items to add, delete and update
  const projectLinks: ProjectLinksForSave = {
    add: [],
    delete: [],
    update: [],
    updateUrl
  }
  // set status to existing items
  formData.url_for_project.forEach((item, pos) => {
    // get the latest value of uuid (this is id prop from database)
    const uuid = getValues(`url_for_project.${pos}.uuid`)
    const title = getFieldState(`url_for_project.${pos}.title`)
    const url = getFieldState(`url_for_project.${pos}.url`)
    // debugger
    // update items position after possible manipulation
    if (item.position !== pos) {
      item.position = pos
      updateUrl(pos, item)
    }
    // we need first to check if uuid=null
    // new items, without id, have also dirty state
    if (uuid === null) {
      // provide item in ProjectLink format
      // id is null for new items
      projectLinks.add.push({
        id: null,
        project: item.project ?? projectState?.id ?? '',
        title: item.title,
        url: item.url,
        position: item.position
      })
    } else if (title.isDirty === true || url.isDirty === true) {
      // provide item in ProjectLink format
      // uuid is mapped back to id for api
      projectLinks.update.push({
        id: item.uuid,
        project: item.project ?? projectState?.id ?? '',
        title: item.title,
        url: item.url,
        position: item.position
      })
    }
  })
  // check if any link items were deleted
  if (projectState?.url_for_project && projectState?.url_for_project.length > 0) {
    // extract items to delete
    const toDelete: ProjectLinkInForm[] = itemsNotInReferenceList({
      list: projectState?.url_for_project,
      referenceList: formData.url_for_project,
      key: 'uuid'
    })
    // add delete items to links collection
    // for deletion we only need id's stored in uuid prop
    toDelete.forEach(item => {
      if (item.uuid) projectLinks.delete.push(item.uuid)
    })
  }

  return projectLinks
}
