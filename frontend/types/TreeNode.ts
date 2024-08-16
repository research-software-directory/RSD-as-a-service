// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export class TreeNode<T> {
	#children: Set<TreeNode<T>> = new Set();
	#value: T;

	constructor(value: T) {
		this.#value = value;
	}

	addChild(node: TreeNode<T>) {
		this.#children.add(node);
	}

	deleteChild(node: TreeNode<T>) {
		this.#children.delete(node);
	}

	childrenCount(): number {
		return this.#children.size;
	}

	getValue(): T {
		return this.#value;
	}

	setValue(value: T) {
		this.#value = value;
	}

	children(): TreeNode<T>[] {
		return Array.from(this.#children);
	}

	forEach(consumer: (node: TreeNode<T>) => void) {
		consumer(this);
		for (const child of this.#children) {
			child.forEach(consumer);
		}
	}

	subTreeWhereLeavesSatisfy(
		predicate: (value: T) => boolean,
	): TreeNode<T> | null {
		if (this.#children.size === 0) {
			return predicate(this.#value) ? new TreeNode<T>(this.#value) : null;
		}

		const newNode = new TreeNode<T>(this.#value);
		for (const child of this.#children) {
			const newSubTree = child.subTreeWhereLeavesSatisfy(predicate);
			if (newSubTree !== null) {
				newNode.addChild(newSubTree);
			}
		}

		return newNode.#children.size === 0 ? null : newNode;
	}

	sortRecursively(comparator: (val1: T, val2: T) => number) {
		const childrenArray = this.children();
		childrenArray.sort((n1, n2) => comparator(n1.#value, n2.#value));
		this.#children = new Set(childrenArray);
		for (const child of this.#children) {
			child.sortRecursively(comparator);
		}
	}
}
