// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export class PromisePool {
  readonly size: number
  #runningPromisesCounter: number = 0
  #tasks: any[] = []

  constructor(size: number) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new Error('The size should be a positive integer')
    }
    this.size = size
  }

  async submit<T>(promiseProducer: () => Promise<T>): Promise<T> {
    return new Promise((res, rej) => {
      this.#tasks.push({res, rej, promiseProducer})
      this.#tryNextTask()
    })
  }

  #tryNextTask() {
    if (this.#tasks.length === 0 || this.#runningPromisesCounter >= this.size) {
      return
    }

    this.#runningPromisesCounter++
    const {res, rej, promiseProducer} = this.#tasks.shift()
    const task = promiseProducer()
    task.then((result: any) => res(result))
      .catch((error: any) => rej(error))
      .finally(() => {
        this.#runningPromisesCounter--
        this.#tryNextTask()
      })
  }

}
