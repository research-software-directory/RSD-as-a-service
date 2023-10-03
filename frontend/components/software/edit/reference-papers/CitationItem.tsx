// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'
import {getMentionType} from '~/components/mention/config'
import MentionAuthors from '~/components/mention/MentionAuthors'
import MentionDoi from '~/components/mention/MentionDoi'
import {MentionTitle} from '~/components/mention/MentionItemBase'
import MentionPublisherItem from '~/components/mention/MentionPublisherItem'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'

export type CitationItemProps = MentionItemProps & {
  reference_papers: string[]
}

function ReferencePapers({papers}:{papers:string[]}){
  const {mentions} = useEditMentionReducer()
  const reference:{doi:string,url:string}[] =[]

  if (papers?.length===0 || mentions?.length===0){
    return (
      <div className="text-sm">
        Referenced paper:
      </div>
    )
  }

  papers.forEach(uuid=>{
    const found = mentions.find(item=>item.id === uuid)
    if (found?.doi && found.url) reference.push({doi:found.doi, url:found.url})
  })

  if (reference.length === 0){
    return (
      <div className="text-sm">
        Referenced: <i>None</i>
      </div>
    )
  }

  return(
    <div className="flex flex-wrap gap-2 text-sm  text-base-content-secondary">
      Referenced: {
        reference.map(item=>{
          return (
            <a
              key={item.url}
              href={item.url} target="_blank" rel="noreferrer"
              className="text-sm "
            >
              {item.doi}
            </a>
          )
        })
      }
    </div>
  )
}


export default function CitationItem({item}:{item:CitationItemProps}){
  const title = getMentionType(item?.mention_type,'singular')
  return (
    <div data-testid="citation-view-item-body" className="py-2 px-4 hover:bg-base-200">
      <div className="text-base-content-disabled">
        {title}
      </div>
      <MentionTitle
        title={item?.title ?? ''}
        role="list"
        url={item.url}
        className="text-base"
      />
      <MentionAuthors
        authors={item.authors}
        className="text-sm text-base-content-secondary"
      />
      <MentionPublisherItem
        publisher={item?.publisher ?? ''}
        page={item?.page ?? ''}
        publication_year={item.publication_year}
        journal = {item.journal}
        className="text-sm text-base-content-secondary"
      />
      <MentionDoi
        url={item?.url}
        doi={item?.doi}
        className="text-sm"
      />
      <ReferencePapers papers={item.reference_papers} />
    </div>
  )
}
