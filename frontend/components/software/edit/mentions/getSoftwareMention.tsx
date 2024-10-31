// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getMentionsForSoftware} from '~/utils/editMentions'
import {getCitationsBySoftware} from './citations/apiCitationsBySoftware'
import {getReferencePapersForSoftware} from './reference-papers/apiReferencePapers'

export async function getSoftwareMention(software:string,token:string){
  try{
    const [reference_papers,citations,output] = await Promise.all([
      getReferencePapersForSoftware({
        software,
        token
      }),
      getCitationsBySoftware({
        software,
        token
      }),
      getMentionsForSoftware({
        software,
        token
      }),
    ])
    // debugger
    return {
      reference_papers,
      citations,
      output,
    }
  }catch{
    return {
      reference_papers: [],
      citations: [],
      output: [],
    }
  }
}
