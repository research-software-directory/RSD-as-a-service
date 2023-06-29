// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type TenantStatusProps = {
  is_tenant: boolean
  width?: string
  borderRadius?: string
  letterSpacing?: string
}

export default function TenantStatus({
  is_tenant,
  width = '6rem',
  borderRadius = '0 0rem 3rem 0',
  letterSpacing = '0.125rem'
}: TenantStatusProps) {

  if (is_tenant===true) {
    return (
      <div
        className="absolute left-0 top-4 bg-primary text-base-100 px-2 py-1 text-xs uppercase font-medium opacity-60"
        style={{width, borderRadius, letterSpacing}}
      >
        Verified
      </div>
    )
  }

  return null
}
