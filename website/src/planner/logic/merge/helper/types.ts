import { SimpleGPX } from '../../../../utils/SimpleGPX.ts';

export interface NamedGpx {
    points: SimpleGPX;
    name: string;
}
