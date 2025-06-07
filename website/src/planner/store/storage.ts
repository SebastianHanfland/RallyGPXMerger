import { State } from './types.ts';

import { optionallyCompress } from './compressHelper.ts';
import { CalculatedTrack, GpxSegment } from '../../common/types.ts';

const localStorage = window.localStorage;

const stateKey = `gpxMerger.state`;

const save = (value: State) => {
    try {
        const { layout, gpxSegments, calculatedTracks, geoCoding, trackMerge, map, points, backend, segmentData } =
            value;
        localStorage.setItem(stateKey + '.layout', JSON.stringify(layout));
        localStorage.setItem(stateKey + '.gpxSegments', JSON.stringify(gpxSegments));
        localStorage.setItem(stateKey + '.map', JSON.stringify(map));
        localStorage.setItem(stateKey + '.points', JSON.stringify(points));
        localStorage.setItem(stateKey + '.trackMerge', JSON.stringify(trackMerge));
        localStorage.setItem(stateKey + '.geoCoding', JSON.stringify(geoCoding));
        localStorage.setItem(stateKey + '.calculatedTracks', JSON.stringify(calculatedTracks));
        localStorage.setItem(stateKey + '.backend', JSON.stringify(backend));
        localStorage.setItem(stateKey + '.segmentData', JSON.stringify(segmentData));
    } catch (error) {
        console.log(error);
    }
};

function isDefined(statePart: string | null): statePart is string {
    return !!statePart && statePart !== 'undefined';
}

const load = (): State | undefined => {
    try {
        let layout = undefined;
        let gpxSegments = undefined;
        let map = undefined;
        let points = undefined;
        let trackMerge = undefined;
        let geoCoding = undefined;
        let calculatedTracks = undefined;
        let backend = undefined;
        let segmentData = undefined;

        const layoutString = localStorage.getItem(stateKey + '.layout');
        if (isDefined(layoutString)) {
            layout = JSON.parse(layoutString);
        }
        const gpxSegmentsStringified = localStorage.getItem(stateKey + '.gpxSegments');
        if (isDefined(gpxSegmentsStringified)) {
            const parsedSegments = JSON.parse(gpxSegmentsStringified);
            const compressedSegments =
                parsedSegments.segments?.map((segment: GpxSegment) => ({
                    ...segment,
                    content: optionallyCompress(segment.content),
                })) ?? [];
            gpxSegments = { ...parsedSegments, segments: compressedSegments };
        }
        const mapStringified = localStorage.getItem(stateKey + '.map');
        if (isDefined(mapStringified)) {
            map = JSON.parse(mapStringified);
        }
        const pointsStringified = localStorage.getItem(stateKey + '.points');
        if (isDefined(pointsStringified)) {
            points = JSON.parse(pointsStringified);
        }
        const trackMergeStringified = localStorage.getItem(stateKey + '.trackMerge');
        if (isDefined(trackMergeStringified)) {
            trackMerge = JSON.parse(trackMergeStringified);
        }
        const geoCodingStringified = localStorage.getItem(stateKey + '.geoCoding');
        if (isDefined(geoCodingStringified)) {
            geoCoding = JSON.parse(geoCodingStringified);
        }
        const backendStringified = localStorage.getItem(stateKey + '.backend');
        if (isDefined(backendStringified)) {
            backend = JSON.parse(backendStringified);
        }
        const segmentDataStringified = localStorage.getItem(stateKey + '.segmentData');
        if (isDefined(segmentDataStringified)) {
            segmentData = JSON.parse(segmentDataStringified);
        }
        const calculatedTracksStringified = localStorage.getItem(stateKey + '.calculatedTracks');
        if (isDefined(calculatedTracksStringified)) {
            const parsedTracks = JSON.parse(calculatedTracksStringified);
            const compressedTracks =
                parsedTracks.tracks?.map((segment: CalculatedTrack) => ({
                    ...segment,
                    content: optionallyCompress(segment.content),
                })) ?? [];
            calculatedTracks = { ...parsedTracks, tracks: compressedTracks };
        }
        return {
            layout,
            gpxSegments,
            map,
            points,
            trackMerge,
            geoCoding,
            calculatedTracks,
            backend,
            segmentData,
        } as State;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

const clear = () => {
    try {
        localStorage.removeItem(stateKey);
        localStorage.removeItem(stateKey + '.layout');
        localStorage.removeItem(stateKey + '.gpxSegments');
        localStorage.removeItem(stateKey + '.map');
        localStorage.removeItem(stateKey + '.trackMerge');
        localStorage.removeItem(stateKey + '.geoCoding');
        localStorage.removeItem(stateKey + '.calculatedTracks');
        localStorage.removeItem(stateKey + '.backend');
        localStorage.removeItem(stateKey + '.segmentData');
    } catch (error) {
        console.log(error);
    }
};

export const storage = { save, load, clear };
