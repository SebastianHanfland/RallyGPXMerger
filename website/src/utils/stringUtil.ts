export function limitString(name: string, maxLength: number) {
    return name.length > maxLength ? name.slice(0, maxLength) : name;
}
