// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export class TreeNode<Type> {
  #children: TreeNode<Type>[] = []
  #value: Type | null

  constructor(value: Type | null) {
    this.#value = value
  }

  clone() {
    const clone = new TreeNode(this.#value)
    clone.#children = [...this.children()]
    return clone
  }

  addChild(node: TreeNode<Type>) {
    this.#children.push(node)
  }

  deleteChild(node: TreeNode<Type>) {
    const index = this.#children.indexOf(node)
    if (index >= 0) {
      this.#children.splice(index, 1)
    }
  }

  childrenCount(): number {
    return this.#children.length
  }

  getValue() {
    return this.#value
  }

  setValue(value: Type | null) {
    this.#value = value
  }

  children(): TreeNode<Type>[] {
    return this.#children
  }

  asString(): string {
    return JSON.stringify(this.#value)
  }
}
