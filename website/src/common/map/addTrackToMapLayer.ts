import L, { LayerGroup, LeafletMouseEvent, Polyline } from 'leaflet';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { breakIcon, endIcon, startIcon } from '../MapIcons.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { ParsedTrack } from '../types.ts';
import { getLanguage } from '../../language.ts';
import { Point } from '../../utils/gpxTypes.ts';

function toLatLng(point: Point): { lat: number; lng: number } {
    return { lat: point.lat, lng: point.lon };
}

export interface MapOptions {
    showMarker: boolean;
    onlyShowBreaks?: boolean;
    color?: string;
    opacity?: number;
    weight?: number;
    highlightedId?: string;
    clickCallBack?: (track: ParsedTrack, event?: LeafletMouseEvent) => void;
    mouseInCallBack?: (track: ParsedTrack) => void;
    mouseOutCallBack?: (track: ParsedTrack) => void;
}

function setStartMarker(startPosition: { lat: number; lng: number }, routeLayer: LayerGroup<any>, trackName: string) {
    const startMarker = L.marker(startPosition, {
        icon: startIcon,
        title: getLanguage() === 'de' ? `Start von ${trackName}` : `Start of ${trackName}`,
    });
    startMarker.addTo(routeLayer);
}

function addBreakMarkerToMap(
    point: Point,
    parsedTrack: ParsedTrack,
    timeDifferenceInSeconds: number,
    lastTimeStamp: string,
    routeLayer: LayerGroup<any>
) {
    const breakText = getLanguage() === 'de' ? 'min Pause\n um' : 'min Break\n at';
    const breakMarker = L.marker(toLatLng(point), {
        icon: breakIcon,
        title: `${parsedTrack.filename ? parsedTrack.filename + ' - ' : ''}${(timeDifferenceInSeconds / 60).toFixed(
            0
        )} ${breakText} ${formatTimeOnly(lastTimeStamp, true)}`,
    });
    breakMarker.addTo(routeLayer);
}

function addBreakMarker(options: MapOptions, parsedTrack: ParsedTrack, routeLayer: LayerGroup<any>) {
    if (!options.showMarker) {
        return;
    }

    let lastPoint: Point | null = null;
    parsedTrack.points.forEach((point) => {
        const lastTimeStamp = lastPoint?.time;
        if (lastTimeStamp) {
            const timeDifferenceInSeconds = getTimeDifferenceInSeconds(point.time, lastTimeStamp);
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

function addCallBacks(options: MapOptions, trackOnMap: Polyline, parsedTrack: ParsedTrack) {
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

function drawTrackOnMap(trackPoints: { lat: number; lng: number }[], options: MapOptions, parsedTrack: ParsedTrack) {
    return L.polyline(trackPoints, {
        weight: options.weight ?? 8,
        color: options.color ?? getColorFromUuid(parsedTrack.id),
        opacity: options.opacity ?? 0.6,
    }).bindTooltip(parsedTrack.filename, {
        sticky: true,
    });
}

export function addTrackToMap(parsedTrack: ParsedTrack, routeLayer: LayerGroup, options: MapOptions) {
    const trackPoints = parsedTrack.points.map(toLatLng);
    const trackOnMap = drawTrackOnMap(trackPoints, options, parsedTrack);
    addCallBacks(options, trackOnMap, parsedTrack);

    trackOnMap.addTo(routeLayer);
    if (options.onlyShowBreaks) {
        setStartMarker(trackPoints[0], routeLayer, parsedTrack.filename);
        addBreakMarker(options, parsedTrack, routeLayer);
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
    parsedTracks: ParsedTrack[],
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
