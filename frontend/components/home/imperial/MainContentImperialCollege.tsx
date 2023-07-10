// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HomeProps} from 'pages'
import CounterBox from './CounterBox'
import {useSession} from '~/auth'
import useImperialData from './useImperialData'
import ContentLoader from '~/components/layout/ContentLoader'
import MainContent from '~/components/layout/MainContent'

export default function MainContentImperialCollege({counts}: HomeProps) {
  const {token} = useSession()
  const {loading, organisations} = useImperialData(token)

  return (
    <MainContent>
      <h1>Main content placeholder</h1>

      {/* COUNTERS SECTION EXAMPLE */}
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-between gap-10 md:gap-16 p-5 md:p-10 ">
        <CounterBox
          label="Open-Source Software"
          value={counts.software_cnt.toString()}
        />
      </div>

      {
      /* ORGANISATION LIST EXAMPLE
        show spinner when loading===true,
        otherwise show json organisation data
        received from useImperialData custom hook (line 10)
      */}
      {
        loading ?
          <ContentLoader />
        :
          <div className="mb-12">
            <pre>
              {JSON.stringify(organisations,null,' ')}
            </pre>
          </div>
      }

    </MainContent>
  )
}
