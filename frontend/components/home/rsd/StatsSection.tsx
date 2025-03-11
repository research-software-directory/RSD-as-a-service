// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type StarsSectionProps={
  software_cnt: number,
  project_cnt: number,
  organisation_cnt: number,
  contributor_cnt: number,
  software_mention_cnt: number,
}


export default function StarsSection({
  software_cnt,project_cnt,organisation_cnt,
  contributor_cnt,software_mention_cnt
}:StarsSectionProps) {
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto flex flex-wrap md:justify-between gap-10 md:gap-16 p-4 md:px-10">
      <div>
        <div className="text-lg">{software_cnt} Software</div>
        <div className="opacity-50">packages registered</div>
      </div>

      <div>
        <div className="text-lg">{project_cnt} Projects</div>
        <div className="opacity-50">registered</div>
      </div>

      <div>
        <div className="text-lg">{organisation_cnt} Organisations</div>
        <div className="opacity-50">contributed</div>
      </div>

      <div>
        <div className="text-lg">{contributor_cnt} Contributors</div>
        <div className="opacity-50">to research software</div>
      </div>

      <div>
        <div className="text-lg">{software_mention_cnt} Mentions</div>
        <div className="opacity-50">of research software</div>
      </div>
    </div>
  )
}
