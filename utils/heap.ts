export class Heap<T> {
    _list: (T | undefined)[];
    _lastLeaf: number;

    _comparator: (a: T, b: T) => number;
    _capacity: number;
    _canGrow: boolean;

    constructor(comparator: (a: T, b: T) => number, capacity: number, canGrow: boolean = false) {
        this._list = new Array(capacity);
        this._lastLeaf = 0;
        this._comparator = comparator;

        this._capacity = capacity;
        this._canGrow = canGrow;
    }

    push(item: T): boolean {
        const hasSpace: boolean = this._lastLeaf < this._capacity;
        const isFullButGreater: boolean = this._lastLeaf >= this._capacity && this._comparator(item, this._getLastLeafNode()!) > 0;
        if (hasSpace || isFullButGreater) this._setLastLeafNode(item);

        this._bubbleUp(this._lastLeaf);

        this._incLastLeaf();

        return hasSpace || isFullButGreater;
    }

    peek(): T | undefined {
        return this._list[0];
    }

    pop(): T | undefined {
        // 1. Save top element
        const item: T | undefined = this.peek();

        // 2. Find last leaf that is not undefined
        let lastIndex: number = this._lastLeaf;

        while (lastIndex >= 0 && this._list[lastIndex] == undefined) lastIndex--;

        // 3. Swap top with last leaf
        this._swap(0, lastIndex);
        // 4. Remove last leaf (the popped root)
        delete this._list[lastIndex];
        this._lastLeaf--;

        // 5. Reorder heap
        this._bubbleDown(0);

        return item;
    }

    _setLastLeafNode(item: T): void {
        this._list[this._lastLeaf] = item;
    }

    _getLastLeafNode(): T | undefined {
        return this._list[this._lastLeaf];
    }

    _bubbleDown(parentIndex: number): void {
        const leftChild: T | undefined = this._getLeftChild(parentIndex);
        const rightChild: T | undefined = this._getRightChild(parentIndex);

        // 1. Is a leaf node
        if (leftChild === undefined && rightChild === undefined) return;

        // 2. Choose direction to bubble down
        let largerChildIndex: number;
        if (leftChild === undefined) largerChildIndex = this._getRightChildIndex(parentIndex);
        else if (rightChild === undefined) largerChildIndex = this._getLeftChildIndex(parentIndex);
        else largerChildIndex = this._comparator(leftChild, rightChild) > 0 ? this._getLeftChildIndex(parentIndex) : this._getRightChildIndex(parentIndex);

        // 3. Check if should bubble down
        const parentNode: T | undefined = this._list[parentIndex];
        const largerChild: T | undefined = this._list[largerChildIndex];
        if (!parentNode || !largerChild) return;

        const lessThanChild: boolean = this._comparator(parentNode, largerChild) < 0;
        // 4. Parent is smaller than larger child
        if (lessThanChild) {
            this._swap(parentIndex, largerChildIndex);
            this._bubbleDown(largerChildIndex);
        }
    }

    _bubbleUp(childIndex: number): void {
        if (childIndex === 0) return;

        const childNode: T | undefined = this._list[childIndex];
        const parentNode: T | undefined = this._getParent(childIndex);

        if (!childNode || !parentNode) return;

        const greaterThanParent: boolean = this._comparator(childNode, parentNode) > 0;
        if (greaterThanParent) {
            const parentIndex: number = this._getParentIndex(childIndex);
            this._swap(childIndex, parentIndex);
            this._bubbleUp(parentIndex);
        }
    }

    _swap(i1: number, i2: number): void {
        const temp: T | undefined = this._list[i1];
        this._list[i1] = this._list[i2];
        this._list[i2] = temp;
    }

    _incLastLeaf(): number {
        // 1. Check if full
        if (this._lastLeaf >= this._capacity - 1) {
            // 2. Double capacity
            if (this._canGrow) {
                this._list = this._list.concat(new Array(this._capacity));
                this._capacity *= 2;

                this._lastLeaf++;
            }
        }
        // 2. Inc last leaf index
        else {
            this._lastLeaf++;
        }

        return this._lastLeaf;
    }

    _decLastLeaf() {
        this._lastLeaf--;
        return this._lastLeaf;
    }

    _getLeftChildIndex(parentIndex: number): number {
        return parentIndex * 2 + 1;
    }

    _getRightChildIndex(parentIndex: number): number {
        return parentIndex * 2 + 2;
    }

    _getLeftChild(parentIndex: number): T | undefined {
        return this._list[this._getLeftChildIndex(parentIndex)];
    }

    _getRightChild(parentIndex: number): T | undefined {
        return this._list[this._getRightChildIndex(parentIndex)];
    }

    _getParentIndex(childIndex: number): number {
        return Math.floor((childIndex - 1) / 2);
    }

    _getParent(childIndex: number): T | undefined {
        return this._list[this._getParentIndex(childIndex)];
    }
}

const heap: Heap<number> = new Heap((a, b) => a - b, 8, true);
for (let i = 0; i < 20; i++) {
    heap.push(Math.random() * 10);
    // console.log(heap._list);
    // console.log(heap._lastLeaf);
}
// console.log(heap._list);

// console.log(heap.pop());
// console.log(heap._list);
// console.log(heap.pop());
// console.log(heap._list);

// console.log(heap._list);
for (let i = 0; i < 26; i++) {
    console.log(`${i}: ${heap.pop()}`);
    // console.log(heap._list.slice(0, 7));
}
console.log(heap._list);

// console.log(heap._list);
