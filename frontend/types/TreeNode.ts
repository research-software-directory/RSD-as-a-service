// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export class TreeNode<Type> {
  #children: Set<TreeNode<Type>> = new Set()
  #value: Type | null

  constructor(value: Type | null) {
    this.#value = value
  }

  addChild(node: TreeNode<Type>) {
    this.#children.add(node)
  }

  deleteChild(node: TreeNode<Type>) {
    this.#children.delete(node)
  }

  childrenCount(): number {
    return this.#children.size
  }

  getValue() {
    return this.#value
  }

  setValue(value: Type | null) {
    this.#value = value
  }

  children(): TreeNode<Type>[] {
    return Array.from(this.#children)
  }

  subTreeWhereLeavesSatisfy(predicate: (value: Type) => boolean): TreeNode<Type> | null {
    if (this.#children.size === 0) {
      return (this.#value === null || !(predicate(this.#value)) ? null : new TreeNode<Type>(this.#value))
    }

    const newNode = new TreeNode<Type>(this.#value)
    for (const child of this.#children) {
      const newSubTree = child.subTreeWhereLeavesSatisfy(predicate)
      if (newSubTree !== null) {
        newNode.addChild(newSubTree)
      }
    }

    return newNode.#children.size === 0 ? null : newNode
  }

  sortRecursively(comparator: (val1: Type, val2: Type) => number) {
    const childrenArray = this.children()
    childrenArray.sort((n1, n2) => comparator(n1.#value!, n2.#value!))
    this.#children = new Set(childrenArray)
    for (const child of this.#children) {
      child.sortRecursively(comparator)
    }
  }
}
