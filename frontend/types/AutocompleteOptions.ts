// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export type AutocompleteOption<T> = {
  key: string
  label: string
  data: T
}


export type AutocompleteOptionWithLink<T> = {
  key: string
  label: string,
  link: string,
  data: T
}
