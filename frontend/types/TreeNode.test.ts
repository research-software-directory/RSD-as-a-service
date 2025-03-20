// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {TreeNode} from '~/types/TreeNode'

test('method subTreeWhereNodesSatisfyWithChildren works correctly', () => {
  const root = new TreeNode('abc')
  root.addChild(new TreeNode('def'))
  root.addChild(new TreeNode('123'))

  const filteredTree = root.subTreeWhereNodesSatisfyWithChildren(s => s === 'abc')
  expect(filteredTree).toBeTruthy()
  expect(filteredTree?.childrenCount()).toBe(2)
  expect(filteredTree?.getValue()).toBe('abc')

  const filteredTree2 = root.subTreeWhereNodesSatisfyWithChildren(s => s === '123')
  expect(filteredTree2).toBeTruthy()
  expect(filteredTree2?.childrenCount()).toBe(1)
})

test('method subTreeWhereNodesSatisfyWithoutChildren works correctly', () => {
  const root = new TreeNode('abc')
  root.addChild(new TreeNode('def'))
  root.addChild(new TreeNode('123'))

  const filteredTree = root.subTreeWhereNodesSatisfyWithoutChildren(s => s === 'abc')
  expect(filteredTree).toBeTruthy()
  expect(filteredTree?.childrenCount()).toBe(0)
  expect(filteredTree?.getValue()).toBe('abc')

  const filteredTree2 = root.subTreeWhereNodesSatisfyWithoutChildren(s => s === '123')
  expect(filteredTree2).toBeTruthy()
  expect(filteredTree2?.childrenCount()).toBe(1)
})

test('method subTreeWhereLeavesSatisfy works correctly', () => {
  const root = new TreeNode('abc')
  root.addChild(new TreeNode('def'))
  root.addChild(new TreeNode('123'))

  const filteredTree = root.subTreeWhereLeavesSatisfy(s => s === 'abc')
  expect(filteredTree).toBeNull()

  const filteredTree2 = root.subTreeWhereLeavesSatisfy(s => s === '123')
  expect(filteredTree2).toBeTruthy()
  expect(filteredTree2?.childrenCount()).toBe(1)
})
