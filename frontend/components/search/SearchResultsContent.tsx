// SPDX-FileCopyrightText: 2025 Jesse Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {GlobalSearchResults} from '~/components/GlobalSearchAutocomplete/apiGlobalSearch'
import {RsdModuleName} from '~/config/rsdSettingsReducer'
import {composeUrl} from '~/utils/fetchHelpers'
import {getImageUrl} from '~/utils/editImage'
import SearchItemIcon from '~/components/GlobalSearchAutocomplete/SearchItemIcon'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'

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
        className="flex items-start gap-4 p-4 rounded-md bg-base-100 shadow-md hover:shadow-lg transition"
      >
        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden bg-base-200">
          <ImageWithPlaceholder
            src={imageUrl}
            alt={`Logo for ${item.name}`}
            type="gradient"
            className="w-full h-full text-base-content-disabled"
            bgSize='scale-down'
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium line-clamp-2 mb-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-base-content-secondary">
            <SearchItemIcon source={item.source} />
            <span className="capitalize">{item.source}</span>
            {isExternal && (
              <span className="text-xs">
                ({item.rsd_host || item.domain})
              </span>
            )}
          </div>
          {!item.is_published && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-warning text-warning-content rounded">
              Unpublished
            </span>
          )}
        </div>
        {isExternal && (
          <div className="flex-shrink-0 text-base-content-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        )}
      </Link>
    )
  }

  // Grid view
  return (
    <Link
      href={url}
      target={isExternal ? '_blank' : '_self'}
      className="flex flex-col rounded-md bg-base-100 shadow-md hover:shadow-lg transition overflow-hidden h-full group"
    >
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
        <div className="flex items-start gap-3 mb-3">
          {isExternal && (
            <div className="flex-shrink-0 ml-auto text-base-content-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="text-base font-medium line-clamp-2 group-hover:text-primary mb-2">
          {item.name}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-sm text-base-content-secondary">
            <SearchItemIcon source={item.source} />
            <span className="capitalize">{item.source}</span>
          </div>
          {isExternal && (
            <div className="text-xs text-base-content-secondary mt-1">
              {item.rsd_host || item.domain}
            </div>
          )}
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
    <h2 className="text-2xl font-medium capitalize mb-4 flex items-center gap-2">
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
    <div className="px-4 pb-12">
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
