export function chunkList<T>(elements: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < elements.length; i += chunkSize) {
        const chunk = elements.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}
