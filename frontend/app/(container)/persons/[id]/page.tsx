import {notFound,redirect} from 'next/navigation'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'

/**
 * This page redirects to software or project tab or 404 page!
 * @param param0
 * @returns
 */
export default async function PersonRedirectPage({params}:{params: Promise<{id: string}>}) {
  const [{id},modules] = await Promise.all([
    params,
    getActiveModuleNames()
  ])

  if (!id){
    return notFound()
  }

  // default tab is software
  let tab = ''
  if (modules?.includes('software')){
    tab='software'
  } else if (modules?.includes('projects')){
    tab='projects'
  }

  // if software and projects module are disabled we do not show persons
  if (tab===''){
    return notFound()
  }

  return redirect(`/persons/${id}/${tab}`)
}
