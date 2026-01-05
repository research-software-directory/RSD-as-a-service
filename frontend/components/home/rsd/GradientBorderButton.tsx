// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function GradientBorderButton({text, url, target = '_self', minWidth = '9rem'}: {text: string, url: string, target?: string, minWidth?: string}) {
  return <a href={url} className="cursor-pointer" target={target}>
    <button style={{minWidth}} className="group m-2 p-[0.125rem] rounded-sm transition duration-500 bg-linear-to-tl to-base-400 via-base-500 from-primary bg-size-200 bg-pos-0 hover:bg-pos-100">
      <span className="flex w-full bg-base-800  p-4 rounded-sm justify-center pointer-events-non group-hover:bg-base-700 transition duration-300  text-base-400 group-hover:text-base-100">
        {text}
      </span></button>
  </a>
}
