import { SimpleGPX } from './gpxutils.ts';

/**
 * @deprecated use new SimpleGPX((SimpleGPX)[]) instead
 */
export function mergeGpxs(first: SimpleGPX, second: SimpleGPX): SimpleGPX {
    return new SimpleGPX([first, second]);
}
