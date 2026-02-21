export function isDefined<T>(element: T | undefined | null): element is T {
    return !(element === null || element === undefined);
}
