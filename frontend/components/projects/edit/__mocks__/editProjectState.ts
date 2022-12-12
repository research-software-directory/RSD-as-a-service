// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {EditProjectState} from '../editProjectContext'

// MOCK project state
const projectState: EditProjectState = {
  step: undefined,
  project: {
    id: 'test-id',
    slug: 'test-slug',
    title: 'Test project'
  },
  loading: true
}


export default projectState
