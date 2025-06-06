// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'
import {categoryEntriesToRoots} from '~/components/category/apiCategories'
import {TreeNode} from '~/types/TreeNode'
import {shuffle} from '~/utils/jest/utils'

// replace global mock (jest.setup.js) with actual module
jest.mock('~/components/category/apiCategories',()=>jest.requireActual('~/components/category/apiCategories'))


it('generates the category tree correctly', () => {
  const grandChild1: CategoryEntry = {id: 'grandChild1', parent: 'child1', short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}
  const grandChild2: CategoryEntry = {id: 'grandChild2', parent: 'child1', short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}
  const grandChild3: CategoryEntry = {id: 'grandChild3', parent: 'child2', short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}
  const grandChild4: CategoryEntry = {id: 'grandChild4', parent: 'child2', short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}
  const child1: CategoryEntry = {id: 'child1', parent: 'parent', short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}
  const child2: CategoryEntry = {id: 'child2', parent: 'parent', short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}
  const parent: CategoryEntry = {id: 'parent', parent: null, short_name: '', name: '', community: null, provenance_iri: null, organisation: null, allow_projects: false, allow_software:false, properties: {}}

  const entries = [
    parent,
    child1,
    child2,
    grandChild1,
    grandChild2,
    grandChild3,
    grandChild4,
  ]

  shuffle(entries)

  const tree: TreeNode<CategoryEntry>[] = categoryEntriesToRoots(entries)
  expect(tree.length).toEqual(1)
  const parentRoot = tree[0]
  expect(parentRoot.getValue().id).toEqual('parent')
  expect(parentRoot.childrenCount()).toEqual(2)

  parentRoot.sortRecursively((ce1, ce2) => ce1.id.localeCompare(ce2.id))
  const children = parentRoot.children()
  expect(children.length).toEqual(2)
  expect(children[0].getValue().id).toEqual('child1')
  expect(children[1].getValue().id).toEqual('child2')

  const grandChildren1 = children[0].children()
  expect(grandChildren1.length).toEqual(2)
  expect(grandChildren1[0].getValue().id).toEqual('grandChild1')
  expect(grandChildren1[1].getValue().id).toEqual('grandChild2')

  const grandChildren2 = children[1].children()
  expect(grandChildren2.length).toEqual(2)
  expect(grandChildren2[0].getValue().id).toEqual('grandChild3')
  expect(grandChildren2[1].getValue().id).toEqual('grandChild4')
})
