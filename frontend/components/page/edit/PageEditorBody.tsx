// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useForm, FormProvider} from 'react-hook-form'

import {RsdLink} from '~/config/rsdSettingsReducer'
import {MarkdownPage} from '../useMarkdownPages'
import EditMarkdownPage, {SubmitProps} from './EditMarkdownPage'
import NoPageItems from './NoPageItems'
import SortableNav from './SortableNav'

type CustomMarkdownPagesProps = {
  links: RsdLink[]
  selected: string
  onSelect:(item: RsdLink) => void
  onSorted:(items:RsdLink[])=>void
  onDelete: (page: MarkdownPage) => void
  onSubmit: ({status,message,data}:SubmitProps) => void
}


export default function PageEditorBody({links,selected,onSelect,onSorted,onDelete,onSubmit}: CustomMarkdownPagesProps) {
  const methods = useForm<MarkdownPage>({
    mode: 'onChange'
  })
  return (
    <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
      {/* use form provider to pull isDirty state into sortablenav component */}
      <FormProvider {...methods} >
      <div>
        <SortableNav
          onSelect={onSelect}
          selected={selected}
          links={links}
          onSorted={onSorted}
        />
      </div>
      <div>
        {
          links.length > 0 ?
          <EditMarkdownPage
            slug={selected}
            onDelete={onDelete}
            onSubmit={onSubmit}
          />
          : <NoPageItems />
        }
      </div>
      </FormProvider>
    </section>
  )
}
