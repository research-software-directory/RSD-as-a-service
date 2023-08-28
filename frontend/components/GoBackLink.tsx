// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

type Props = {
  className?: string
  text?: string
};

export const GoBackLink = (props: Props) => {
  const router = useRouter()
  return (
    <a className={props.className} onClick={() => router.back()}>
      ⃪  {props.text ?? 'Go back'}
    </a>
  )
}
