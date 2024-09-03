// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {PromisePool} from '~/utils/promisePool'

it('PromisePool class works correctly', async () => {
  const promisePool: PromisePool = new PromisePool(2)
  const messages: string[] = []
  await Promise.all([
    promisePool.submit<string>(() => Promise.resolve('first'))
      .then(result => messages.push(result)),
    promisePool.submit<string>(() => new Promise(res => {
      setTimeout(() => res('fourth'), 200)
    }))
      .then(result => messages.push(result)),
    promisePool.submit<string>(() => Promise.resolve('second'))
      .then(result => messages.push(result)),
    promisePool.submit<string>(() => Promise.resolve('third'))
      .then(result => messages.push(result)),
  ])

  expect(messages).toEqual(['first', 'second', 'third', 'fourth'])
})
