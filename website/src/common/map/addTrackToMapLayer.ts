import L, { LayerGroup, LeafletMouseEvent, Polyline } from 'leaflet';
import { getColor } from '../../utils/colorUtil.ts';
import { breakIcon, endIcon, startIcon } from './MapIcons.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { CalculatedTrack } from '../types.ts';
import { getLanguage } from '../../language.ts';
import { getLatLng } from '../../utils/pointUtil.ts';
import { ParsedGpxSegment, TimedPoint } from '../../planner/store/types.ts';

export interface MapOptions {
    showMarker: boolean;
    onlyShowBreaks?: boolean;
    color?: string;
    opacity?: number;
    weight?: number;
    highlightedId?: string;
    clickCallBack?: (track: CalculatedTrack | ParsedGpxSegment, event?: LeafletMouseEvent) => void;
    mouseInCallBack?: (track: CalculatedTrack | ParsedGpxSegment) => void;
    mouseOutCallBack?: (track: CalculatedTrack | ParsedGpxSegment) => void;
}

function setStartMarker(startPosition: { lat: number; lng: number }, routeLayer: LayerGroup<any>, trackName: string) {
    const startMarker = L.marker(startPosition, {
        icon: startIcon,
        title: getLanguage() === 'de' ? `Start von ${trackName}` : `Start of ${trackName}`,
    });
    startMarker.addTo(routeLayer);
}

function addBreakMarkerToMap(
    point: TimedPoint,
    parsedTrack: CalculatedTrack,
    timeDifferenceInSeconds: number,
    lastTimeStamp: string,
    routeLayer: LayerGroup<any>
) {
    const breakText = getLanguage() === 'de' ? 'min Pause\n um' : 'min Break\n at';
    const breakMarker = L.marker(getLatLng(point), {
        icon: breakIcon,
        title: `${parsedTrack.filename ? parsedTrack.filename + ' - ' : ''}${(timeDifferenceInSeconds / 60).toFixed(
            0
        )} ${breakText} ${formatTimeOnly(lastTimeStamp, true)}`,
    });
    breakMarker.addTo(routeLayer);
}

function addBreakMarker(options: MapOptions, parsedTrack: CalculatedTrack, routeLayer: LayerGroup<any>) {
    if (!options.showMarker) {
        return;
    }

    let lastPoint: TimedPoint | null = null;
    parsedTrack.points.forEach((point) => {
        const lastTimeStamp = lastPoint?.t;
        if (lastTimeStamp) {
            const timeDifferenceInSeconds = getTimeDifferenceInSeconds(point.t, lastTimeStamp);
            if (timeDifferenceInSeconds > 4 * 60) {
                addBreakMarkerToMap(point, parsedTrack, timeDifferenceInSeconds, lastTimeStamp, routeLayer);
            }
        }
        lastPoint = point;
    });
}

function setDestinationOnMap(destination: { lat: number; lng: number }, routeLayer: LayerGroup<any>) {
    const endMarker = L.marker(destination, {
        icon: endIcon,
        title: getLanguage() === 'de' ? `Ziel` : `Destination`,
    });
    endMarker.addTo(routeLayer);
}

function addCallBacks(options: MapOptions, trackOnMap: Polyline, parsedTrack: CalculatedTrack | ParsedGpxSegment) {
    const clickCallBack = options?.clickCallBack;
    if (clickCallBack) {
        trackOnMap.on('click', (event: LeafletMouseEvent) => {
            clickCallBack(parsedTrack, event);
        });
    }

    const mouseInCallBack = options?.mouseInCallBack;
    if (mouseInCallBack) {
        trackOnMap.on('mouseover', () => {
            mouseInCallBack(parsedTrack);
        });
    }

    const mouseOutCallBack = options?.mouseOutCallBack;
    if (mouseOutCallBack) {
        trackOnMap.on('mouseout', () => {
            mouseOutCallBack(parsedTrack);
        });
    }
}

function drawTrackOnMap(
    trackPoints: { lat: number; lng: number }[],
    options: MapOptions,
    parsedTrack: CalculatedTrack | ParsedGpxSegment
) {
    return L.polyline(trackPoints, {
        weight: options.weight ?? 8,
        color: options.color ?? getColor(parsedTrack),
        opacity: options.opacity ?? 0.6,
    }).bindTooltip(parsedTrack.filename, {
        sticky: true,
    });
}

function isParsedGpxSegment(track: CalculatedTrack | ParsedGpxSegment): track is ParsedGpxSegment {
    return (track as ParsedGpxSegment).streetsResolved !== undefined;
}

export function addTrackToMap(
    parsedTrack: CalculatedTrack | ParsedGpxSegment,
    routeLayer: LayerGroup,
    options: MapOptions
) {
    const trackPoints = parsedTrack.points.map(getLatLng);
    if (trackPoints.length === 0) {
        return;
    }
    const trackOnMap = drawTrackOnMap(trackPoints, options, parsedTrack);
    addCallBacks(options, trackOnMap, parsedTrack);

    trackOnMap.addTo(routeLayer);
    if (options.onlyShowBreaks) {
        setStartMarker(trackPoints[0], routeLayer, parsedTrack.filename);
        if (!isParsedGpxSegment(parsedTrack)) {
            addBreakMarker(options, parsedTrack, routeLayer);
        }
        setDestinationOnMap(trackPoints[trackPoints.length - 1], routeLayer);
    } else {
        if (options.showMarker) {
            setStartMarker(trackPoints[0], routeLayer, parsedTrack.filename);
            setDestinationOnMap(trackPoints[trackPoints.length - 1], routeLayer);
        }
    }
}

export function addTracksToLayer(
    mapLayer: React.MutableRefObject<LayerGroup | null>,
    parsedTracks: CalculatedTrack[] | ParsedGpxSegment[],
    show: boolean,
    options: MapOptions
) {
    const current = mapLayer.current;
    if (!mapLayer || !current) {
        return;
    }
    current.clearLayers();
    if (show) {
        parsedTracks.forEach((track) => {
            const enhancedOptions = {
                ...options,
                color: track.color ?? options.color,
                opacity: options.highlightedId === track.id ? 1 : options.opacity,
            };

            addTrackToMap(track, current, enhancedOptions);
        });
    }
}
