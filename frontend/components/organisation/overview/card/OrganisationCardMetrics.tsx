// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type OrganisationMetricsProps = {
  software_cnt: number | null
  project_cnt: number | null
}

export default function OrganisationCardMetrics({software_cnt,project_cnt}:OrganisationMetricsProps) {
  return (
    <>
      {/* Counter */}
      <div>
        <div className='text-5xl font-light'>
          {software_cnt ?? 0}
        </div>
        <div className='text-center text-sm'>
          software <br />package{software_cnt === 1 ? '' : 's'}
        </div>
      </div>
      {/* Counter */}
      <div>
        <div className='text-5xl font-light'>
          {project_cnt ?? 0}
        </div>
        <div className='text-center text-sm'>
          research <br />project{project_cnt === 1 ? '' : 's'}
        </div>
      </div>
    </>
  )
}
