import LZString from 'lz-string';

export function optionallyDecompress(content: string): string {
    if (content === '' || content.includes('trkpt')) {
        return content;
    }
    return LZString.decompress(content);
}

export function optionallyCompress(content: string): string {
    if (content === '' || content.includes('trkpt')) {
        return LZString.compress(content);
    }
    return content;
}
