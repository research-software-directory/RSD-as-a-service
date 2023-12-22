// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
  return (
    <ul className="text-base-content-secondary text-sm flex flex-wrap gap-1">
      {// limits the keywords to 'visibleNumberOfProgLang' per software.
        prog_lang?.slice(0, visibleNumberOfProgLang)
          .map((lang:string, index: number) => (
            <li className="px-1 m-0" key={lang ?? index}>{lang}</li>
          ))}
      { //  Show the number of keywords that are not visible.
        (prog_lang?.length > 0)
        && (prog_lang?.length > visibleNumberOfProgLang)
        && (prog_lang?.length - visibleNumberOfProgLang > 0)
        && <li>{`+ ${prog_lang?.length - visibleNumberOfProgLang}`}</li>
      }
    </ul>
  )
}
