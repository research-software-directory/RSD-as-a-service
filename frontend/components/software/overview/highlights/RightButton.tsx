// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function RightButton({handleNextClick}:{handleNextClick:()=>void}) {
  return (
    <button
      onClick={handleNextClick}
      className="transition duration-500 opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-50 hover:cursor-pointer hover:opacity-100 absolute right-8 top-1/2 z-10"
      aria-label="Next"
    >
      <div className="text-base-100 bg-secondary w-16 h-16 -mt-8 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
          viewBox="0 0 256 256">
          <path fill="currentColor"
            d="m184.49 136.49l-80 80a12 12 0 0 1-17-17L159 128L87.51 56.49a12 12 0 1 1 17-17l80 80a12 12 0 0 1-.02 17Z"></path>
        </svg>
      </div>
    </button>
  )
}
