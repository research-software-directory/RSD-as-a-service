// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useRsdSettings from '~/config/useRsdSettings'

type OrganisationMetricsProps = Readonly<{
  software_cnt: number | null
  project_cnt: number | null
}>

function SoftwareCounter({software_cnt}:Readonly<{software_cnt: number | null}>){
  return (
    <div>
      <div className='text-5xl font-light'>
        {software_cnt ?? 0}
      </div>
      <div className='text-center text-sm'>
          software <br />package{software_cnt === 1 ? '' : 's'}
      </div>
    </div>
  )
}


function ProjectsCounter({project_cnt}:Readonly<{project_cnt: number | null}>){
  return (
    <div>
      <div className='text-5xl font-light'>
        {project_cnt ?? 0}
      </div>
      <div className='text-center text-sm'>
          research <br />project{project_cnt === 1 ? '' : 's'}
      </div>
    </div>
  )

}


export default function OrganisationCardMetrics({software_cnt,project_cnt}:OrganisationMetricsProps) {
  const {host} = useRsdSettings()
  return (
    <>
      {/* Software counter if module enabled */}
      {
        host?.modules?.includes('software') ?
          <SoftwareCounter software_cnt={software_cnt} />
          : null
      }

      {/* Projects counter if modules is enabled */}
      {
        host?.modules?.includes('projects') ?
          <ProjectsCounter project_cnt={project_cnt} />
          : null
      }
    </>
  )
}
