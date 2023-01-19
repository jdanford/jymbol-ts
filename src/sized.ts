type SizedArrays<T> = [
    [],
    [T],
    [T, T],
    [T, T, T],
    [T, T, T, T],
    [T, T, T, T, T],
    [T, T, T, T, T, T],
    [T, T, T, T, T, T, T],
    [T, T, T, T, T, T, T, T],
    // ...
];

export type SizedArray<T, N extends number> = SizedArrays<T>[N];

export function sized<T, N extends number>(values: T[], expectedLength: N): SizedArray<T, N> {
    checkLength(values, expectedLength);
    return values as SizedArray<T, N>;
}

export function hasLength<T, N extends number>(
    array: T[],
    expectedLength: N,
): array is SizedArray<T, N> {
    return array.length === expectedLength;
}

export function checkLength(array: unknown[], expectedLength: number) {
    const actualLength = array.length;
    if (!hasLength(array, expectedLength)) {
        throw Error(`Expected length = ${expectedLength}, got ${actualLength}`);
    }
}
