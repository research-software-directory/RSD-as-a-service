// SPDX-FileCopyrightText: 2025 Jesse Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {GlobalSearchResults} from '~/components/GlobalSearchAutocomplete/apiGlobalSearch'
import {RsdModuleName} from '~/config/rsdSettingsReducer'
import {composeUrl} from '~/utils/fetchHelpers'
import {getImageUrl} from '~/utils/editImage'
import RsdHostLabel from '~/components/cards/RsdHostLabel'
import SearchItemIcon from '~/components/GlobalSearchAutocomplete/SearchItemIcon'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import ExternalLinkIcon from '~/components/software/overview/cards/ExternalLinkIcon'
import RsdHostBanner from '~/components/software/overview/list/RsdHostBanner'

type SearchResultsContentProps = {
  groupedResults: {[key: string]: GlobalSearchResults[]}
  resultCounts: Record<string, number>
  view: string
}

// Simple card component for search results
function SearchResultCard({item, view}: {item: GlobalSearchResults, view: string}) {
  const url = composeUrl({
    domain: item.domain,
    route: item.source,
    slug: item.slug
  })

  const isExternal = !!item.domain

  // Construct image URL
  const imgSrc = getImageUrl(item.image_id ?? null)
  const imageUrl = item.domain && item.image_id ? `${item.domain}${imgSrc}` : imgSrc

  if (view === 'list') {
    return (
      <Link
        href={url}
        target={isExternal ? '_blank' : '_self'}
        className="flex-1 flex items-start rounded-md bg-base-100 shadow-md hover:shadow-lg hover:text-inherit transition group"
      >
        {/* Image */}
        <ListImageWithGradientPlaceholder
          alt={`Cover image for ${item.name}`}
          imgSrc={imageUrl}
        />
        <div className="flex-1 min-w-0 p-2">
          <div className="font-medium mb-1 line-clamp-2 md:line-clamp-1 break-words">
            {item.name}
          </div>
          <div className="text-sm text-base-content-secondary mb-1 line-clamp-2 md:line-clamp-1 break-words">
            {/* show test or empty space holder? */}
            {item?.short_description ?? ' '}
          </div>
          <div className="flex items-center gap-2 text-sm text-base-content-secondary">
            {isExternal ?
              <RsdHostBanner rsd_host={item?.rsd_host} domain={item?.domain}/>
              : null
            }
          </div>
          {!item.is_published && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-warning text-warning-content rounded">
              Unpublished
            </span>
          )}
        </div>
      </Link>
    )
  }

  // Grid view
  return (
    <Link
      href={url}
      target={isExternal ? '_blank' : '_self'}
      className="flex flex-col rounded-md bg-base-100 shadow-md hover:shadow-lg hover:text-inherit transition overflow-hidden h-full group relative"
    >
      {/* Requires tailwind classes relative and group */}
      <ExternalLinkIcon domain={item.domain} />
      {/* Image */}
      <div className="w-full h-40 bg-base-100 flex-shrink-0">
        <ImageWithPlaceholder
          src={imageUrl}
          alt={`Logo for ${item.name}`}
          type="gradient"
          className="w-full h-full text-base-content-disabled p-4"
          bgSize='scale-down'
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 flex-1">
        <RsdHostLabel rsd_host={item?.rsd_host} domain={item?.domain}/>
        <div className="text-base font-medium line-clamp-1 mb-2">
          {item.name}
        </div>
        <div className="text-sm text-base-content-secondary line-clamp-2 mb-2">
          {/* show test or empty space holder? */}
          {item?.short_description ?? ' '}
        </div>
        <div className="mt-auto">
          {!item.is_published && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-warning text-warning-content rounded">
              Unpublished
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// Group header component
function GroupHeader({
  source,
  displayedCount,
  totalCount
}: {
  source: RsdModuleName,
  displayedCount: number,
  totalCount: number
}) {
  return (
    <h2 className="text-2xl font-medium capitalize p-4 flex items-center gap-2">
      <SearchItemIcon source={source} />
      {source}
      <span className="text-base text-base-content-secondary font-normal">
        ({displayedCount > 0 && totalCount > displayedCount
          ? `${displayedCount} of ${totalCount}`
          : totalCount})
      </span>
    </h2>
  )
}

// More results message component
function MoreResultsMessage({count}: {count: number}) {
  return (
    <div className="mt-6 p-4 rounded-md bg-base-200 text-base-content-secondary text-center">
      <p className="text-sm">
        {count} more result{count !== 1 ? 's' : ''} available. Try refining your search or use filters to narrow down results.
      </p>
    </div>
  )
}

export default function SearchResultsContent({
  groupedResults,
  resultCounts,
  view
}: SearchResultsContentProps) {

  return (
    <div className="pb-12">
      {Object.entries(groupedResults).map(([source, items]) => {
        const totalCount = resultCounts[source] || items.length
        const displayedCount = items.length
        const hasMoreResults = totalCount > displayedCount

        return (
          <div key={source} className="mb-12">
            <GroupHeader
              source={source as RsdModuleName}
              displayedCount={displayedCount}
              totalCount={totalCount}
            />

            {view === 'list' ? (
              <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <SearchResultCard key={`${source}-${index}`} item={item} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, index) => (
                  <SearchResultCard key={`${source}-${index}`} item={item} view="grid" />
                ))}
              </div>
            )}

            {hasMoreResults && (
              <MoreResultsMessage count={totalCount - displayedCount} />
            )}
          </div>
        )
      })}
    </div>
  )
}
