import {notFound, redirect} from 'next/navigation'

import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {defaultEditPageId} from '~/components/projects/edit/editProjectMenuItems'

export default async function EditProjectRedirectPage({params}:Readonly<{params: Promise<{slug: string}>}>) {
  const [{slug},modules] = await Promise.all([
    params,
    getActiveModuleNames()
  ])

  if (!slug || modules?.includes('projects')===false){
    return notFound()
  }

  return redirect(`/projects/${slug}/edit/${defaultEditPageId}`)
}
