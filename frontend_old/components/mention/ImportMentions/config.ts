// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const maxRows=50

const config = {
  doiInput: {
    label: 'Provide one DOI per line',
    helperText: 'Provide one DOI per line',
    maxRowsErrorMsg: 'Maximum number of items exceeded',
    maxRows,
  }
}

export default config
