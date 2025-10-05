// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
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
  onSubmit: ({status, message, data}: SubmitProps) => void
}

export default function PageEditorBody({links,selected,onSelect,onSorted,onDelete,onSubmit}: CustomMarkdownPagesProps) {
  const methods = useForm<MarkdownPage>({
    mode: 'onChange'
  })

  if (links.length === 0) {
    return <div className="w-full"><NoPageItems /></div>
  }

  return (
    <section className="flex-1 xl:grid xl:grid-cols-[3fr_1fr] gap-8">
      {/* use form provider to pull isDirty state into sortablenav component */}
      <FormProvider {...methods} >
        {/* grid position on the right side, after edit content */}
        <div style={{order: 1}}>
          <h3>Select page</h3>
          <SortableNav
            onSelect={onSelect}
            selected={selected}
            links={links}
            onSorted={onSorted}
          />
        </div>
        <EditMarkdownPage
          slug={selected}
          onDelete={onDelete}
          onSubmit={onSubmit}
        />
      </FormProvider>
    </section>
  )
}
