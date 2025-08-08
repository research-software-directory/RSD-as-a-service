// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function SoftwareHeritageBadge({swhid}:{swhid:string}) {
  // split id from context
  const [swh] = swhid.split(';')
  const swhLink = `https://archive.softwareheritage.org/${swhid}`
  const imgSrc = `https://archive.softwareheritage.org/badge/${swh}`
  const imgAlt = `Archived | ${swh}`

  return (
    <a href={swhLink} target="_blank">
      <img src={imgSrc}
        alt={imgAlt}
      />
    </a>
  )
}
