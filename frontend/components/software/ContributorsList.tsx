import Avatar from '@mui/material/Avatar'
import {Contributor} from '../../types/Contributor'
import {getDisplayName, getDisplayInitials} from '../../utils/getDisplayName'

export default function ContributorsList({contributors}: { contributors: Contributor[] }) {
  // do not render component if no data
  if (contributors?.length === 0) return null

  return (
    // <div className="flex mt-12 justify-between 2xl:justify-start 2xl:mt-0 lg:flex-[2] lg:flex flex-wrap lg:mr-8">
    <div className="md:grid md:grid-cols-2 hd:grid-cols-3 gap-4 mt-12 2xl:mt-0">
      {contributors.map(item => {
        const displayName = getDisplayName(item)
        if (displayName) {
          return (
            <div key={displayName} className="flex py-4 pr-4 md:pr-8 2xl:pr-12 2xl:pb-8">
              <Avatar
                alt={displayName ?? 'Unknown'}
                src={item.avatar_url ?? ''}
                sx={{
                  width: '3rem',
                  height: '3rem',
                  fontSize: '1rem',
                  marginRight: '1rem'
                }}
              >
                {getDisplayInitials(item)}
              </Avatar>
              <div>
                <div className="text-primary text-xl">
                  {displayName}
                </div>
                <div>
                  {item?.affiliation ?? 'Organisation unknown'}
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
