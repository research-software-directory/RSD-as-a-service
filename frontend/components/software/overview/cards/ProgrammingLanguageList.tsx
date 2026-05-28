// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type ProgrammingLanguageListProps = {
  prog_lang?: string[]
  visibleNumberOfProgLang?:number
}

export default function ProgrammingLanguageList({
  prog_lang = [], visibleNumberOfProgLang = 3}: ProgrammingLanguageListProps
) {

  if (!prog_lang || prog_lang?.length ===0) return null

  // console.group('ProgrammingLanguageList')
  // console.log('prog_lang...', prog_lang)
  // console.groupEnd()

  return (
    <ul
      aria-label={`${prog_lang?.length} programming languages`}
      className="flex-1 flex flex-wrap text-base-content-secondary text-sm">
      {// limits the prog lang to 'visibleNumberOfProgLang' per software.
        prog_lang?.slice(0, visibleNumberOfProgLang)
          .map((lang:string) => (
            <li
              title={lang}
              key={lang}
              className="pr-1 m-0"
            >{lang}</li>
          ))}
      { //  Show the number of keywords that are not visible.
        (prog_lang?.length > 0)
        && (prog_lang?.length > visibleNumberOfProgLang)
        && (prog_lang?.length - visibleNumberOfProgLang > 0)
          ?
          // Added a meaningful aria-label to the overflow count so it reads out clearly
          <li
            aria-label={`${prog_lang?.length - visibleNumberOfProgLang} more programming language(s)`}
            title={`${prog_lang?.length - visibleNumberOfProgLang} more programming language(s)`}
          >
            {`+ ${prog_lang?.length - visibleNumberOfProgLang}`}
          </li>
          : null
      }
    </ul>
  )
}
