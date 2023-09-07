// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type CounterBoxProps = {
  label: string
  value: string
}

export default function CounterBox({label,value}:CounterBoxProps) {
  return (
    <div className="bg-primary text-primary-content p-4 text-center rounded-md">
      <div className="text-2xl">{label}</div>
      <div className="text-4xl">{value}</div>
    </div>
  )
}
