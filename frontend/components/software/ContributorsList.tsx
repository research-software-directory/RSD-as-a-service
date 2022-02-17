
import {Contributor} from '../../types/Contributor'
import ContributorAvatar from './ContributorAvatar'
import {getDisplayName, getDisplayInitials} from '../../utils/getDisplayName'
import {combineRoleAndAffiliation} from '../../utils/editContributors'

export default function ContributorsList({contributors}: { contributors: Contributor[] }) {
  // do not render component if no data
  if (contributors?.length === 0) return null


  return (
    <div className="gap-4 mt-12 md:grid md:grid-cols-2 hd:grid-cols-3 2xl:mt-0">
      {contributors.map(item => {
        const displayName = getDisplayName(item)
        if (displayName) {
          return (
            <div key={displayName} className="flex py-4 pr-4 md:pr-8 2xl:pr-12 2xl:pb-8">
              <ContributorAvatar
                avatarUrl={item.avatar_url ?? ''}
                displayName={displayName}
                displayInitials={getDisplayInitials(item)}
              />
              <div>
                <div className="text-xl text-primary">
                  {displayName}
                </div>
                <div>
                  {combineRoleAndAffiliation(item)}
                </div>
              </div>
            </div>
          )
        }
        return null
      })
      }
    </div>
  )
}
