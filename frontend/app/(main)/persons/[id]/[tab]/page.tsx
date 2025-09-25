import {notFound} from 'next/navigation'

import {getUserSettings} from '~/utils/userSettingsApp'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {parsePersonId} from '~/components/profile/apiProfile'
import ProfileSoftware from '~/components/profile/software'
import {ProfileTabKey} from '~/components/profile/tabs/ProfileTabItems'
import ProfileProjects from '~/components/profile/projects'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'

export default async function PersonPages({
  params,
  searchParams
}:Readonly<{
  params: Promise<{id:string, tab:ProfileTabKey}>,
  searchParams: Promise<{ [key: string]: string | undefined }>,
}>){

  const [{id,tab},query,{token,rsd_page_rows},modules] = await Promise.all([
    params,
    searchParams,
    getUserSettings(),
    getActiveModuleNames()
  ])
  // return 404 if module is not enabled
  if (modules.includes('persons')===false){
    return notFound()
  }

  const {search,page,rows} = ssrBasicParams(query)
  // identify if id is orcid or account id
  const {account,orcid} = parsePersonId(id)
  // calculate rows
  const num_rows = rows ?? rsd_page_rows ?? 12

  switch(tab){
    case 'software':
      return (
        <ProfileSoftware
          search={search}
          orcid={orcid}
          account={account}
          page={page}
          rows={num_rows}
          token={token}
        />
      )
    case 'projects':
      return (
        <ProfileProjects
          search={search}
          orcid={orcid}
          account={account}
          page={page}
          rows={num_rows}
          token={token}
        />
      )
    default:
      return notFound()
  }
}

