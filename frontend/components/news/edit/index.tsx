// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {FormProvider, useForm} from 'react-hook-form'

import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import AutosaveControlledMarkdown from '~/components/form/AutosaveControlledMarkdown'
import {NewsItem, patchNewsTable} from '~/components/news/apiNews'
import {newsConfig as config} from './config'
import AutosaveNewsTextField from './AutosaveNewsTextField'
import EditNewsStickyHeader from './EditNewsStickyHeader'
import AutosaveNewsSwitch from './AutosaveNewsSwitch'
import AutosaveNewsImage from './AutosaveNewsImage'
import NewsItemInfo from './NewsItemInfo'

export default function EditNewsItem({item}:{item:NewsItem}) {
  const methods = useForm<NewsItem>({
    mode: 'onChange',
    defaultValues: item
  })
  const {register, watch} = methods
  // watch form data changes (we use reset in useEffect)
  // const formData = watch()
  const [id,title,summary,author] = watch(['id','title','summary','author'])

  // console.group('EditNewsItem')
  // console.log('item...', item)
  // console.log('id...', id)
  // console.log('title...', title)
  // console.groupEnd()

  return (
    <FormProvider {...methods}>
      <form
        data-testid="news-item-form"
        id="news-item"
        // onSubmit={handleSubmit(onSubmit)}
        className='flex-1 px-4 lg:container lg:mx-auto '>
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id', {required:'id is required'})}
        />
        <EditNewsStickyHeader />
        <EditSection className='xl:grid xl:grid-cols-[3fr_1fr] xl:px-0 xl:gap-[3rem]'>
          <div className="py-4 overflow-hidden">
            {/* TITLE */}
            <AutosaveNewsTextField
              news_id={item.id}
              options={{
                name: 'title',
                label: config.title.label,
                useNull: true,
                defaultValue: item.title,
                helperTextMessage: config.title.help,
                helperTextCnt: `${title?.length || 0}/${config.title.validation.maxLength.value}`,
              }}
              rules={config.title.validation}
            />
            {/* AUTHOR */}
            <div className="py-2"></div>
            <AutosaveNewsTextField
              news_id={item.id}
              options={{
                name: 'author',
                label: config.author.label,
                useNull: true,
                autofocus: true,
                defaultValue: item.author,
                helperTextMessage: config.author.help,
                helperTextCnt: `${author?.length || 0}/${config.author.validation.maxLength.value}`,
              }}
              rules={config.author.validation}
            />
            {/* SUMMARY */}
            <div className="py-2"></div>
            <AutosaveNewsTextField
              news_id={item.id}
              options={{
                name: 'summary',
                label: config.summary.label,
                multiline: true,
                minRows: 3,
                maxRows: 3,
                useNull: true,
                defaultValue: item.summary,
                helperTextMessage: config.summary.help,
                helperTextCnt: `${summary?.length || 0}/${config.summary.validation.maxLength.value}`,
              }}
              rules={config.summary.validation}
            />
            {/* MARKDOWN */}
            <div className="py-4"></div>
            <AutosaveControlledMarkdown
              id={id}
              name="description"
              maxLength={config.description.validation.maxLength.value}
              patchFn={patchNewsTable}
            />
          </div>
          <div className="py-4 min-w-[21rem] xl:my-0">
            {/* PUBLISHED */}
            <EditSectionTitle
              title={config.pageStatus.title}
              subtitle={config.pageStatus.subtitle}
            />
            <AutosaveNewsSwitch
              news_id={id}
              name='is_published'
              label={config.is_published.label}
              defaultValue={item.is_published}
            />
            {/* PUBLICATION DATE */}
            <div className="py-2"></div>
            <AutosaveNewsTextField
              news_id={item.id}
              options={{
                name: 'publication_date',
                label: config.publication_date.label,
                useNull: true,
                defaultValue: item.publication_date,
                helperTextMessage: config.publication_date.help,
                muiProps:{
                  autoComplete: 'off',
                  variant: 'standard',
                  label: config.publication_date.label,
                  type: 'date',
                  slotProps:{
                    inputLabel:{
                      shrink: true
                    }
                  },
                }
              }}
              rules={config.slug.validation}
            />

            {/* IMAGE */}
            <div className="py-4"></div>
            <AutosaveNewsImage />
            <div className="py-4"></div>
            <NewsItemInfo />
          </div>
        </EditSection>
      </form>
    </FormProvider>
  )
}
