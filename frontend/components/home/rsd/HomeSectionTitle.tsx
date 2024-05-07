// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function HomeSectionTitle({label}:{label:string}) {
  return (
    <h2 className="flex justify-center text-3xl lg:text-4xl font-rsd-titles font-bold"
      data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
      {label}
    </h2>
  )
}
