export function binarySearch<T>(searchValue: any, list: T[], comparator: (midValue: T, seachValue: any) => -1 | 0 | 1, startIndex: number, stopIndex: number): number {
    if (list.length < 0) return -1;
    if (startIndex === stopIndex) return startIndex;

    const midIndex = Math.floor((startIndex + stopIndex) / 2);
    const comparisonResult: -1 | 0 | 1 = comparator(list[midIndex], searchValue);
    switch (comparisonResult) {
        case -1:
            const newStop: number = stopIndex - startIndex === 2 ? 0 : midIndex;
            return binarySearch(searchValue, list, comparator, startIndex, newStop);
        case 0:
            return midIndex;
        case 1:
            const newStart: number = stopIndex - startIndex === 2 ? 1 : midIndex;
            return binarySearch(searchValue, list, comparator, newStart, stopIndex);
    }
}
