// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type ModalProps = {
  open: boolean
  pos?: number
}

export type DeleteModalProps = ModalProps & {
  id?: string
  displayName?: string
}

export type ModalStates<T> = {
  edit: T,
  delete: DeleteModalProps
}
