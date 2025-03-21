// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type OrganisationSignUpButtonProps = {
  onClick: (open: boolean) => void
  minWidth: string
  label: string
}

export default function OrganisationSignUpButton({onClick,minWidth,label}:OrganisationSignUpButtonProps) {
  return (
    <button
      aria-describedby="Sign up button"
      onClick={()=>onClick(true)}
    >
      <div className="relative group">
        <div
          className="absolute -inset-1 bg-linear-to-r from-glow-start to-glow-end rounded-lg blur-sm opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
        <div
          className="flex gap-3 text-base-900 relative px-8 py-3 bg-base-100 ring-1 ring-base-800 rounded-sm leading-none items-center justify-center space-x-2"
          style={{
            minWidth
          }}
        >
          <span className="space-y-2 text-xl font-medium whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
    </button>
  )
}
