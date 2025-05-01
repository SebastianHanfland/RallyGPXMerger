import L, { LayerGroup, LeafletMouseEvent } from 'leaflet';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { breakIcon, endIcon, startIcon } from '../MapIcons.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { CalculatedTrack, GpxSegment, isZipTrack, DisplayTrack } from '../types.ts';
import { getGpx } from '../cache/gpxCache.ts';
import { getLanguage } from '../../language.ts';
import { Point, Track } from '../../utils/gpxTypes.ts';

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
    clickCallBack?: (track: GpxSegment | CalculatedTrack | DisplayTrack, event?: LeafletMouseEvent) => void;
    mouseInCallBack?: (track: GpxSegment | CalculatedTrack | DisplayTrack) => void;
    mouseOutCallBack?: (track: GpxSegment | CalculatedTrack | DisplayTrack) => void;
}

function addStartAndBreakMarker(
    options: MapOptions,
    lastTrack: Track | null,
    trackPoints: {
        lat: number;
        lng: number;
    }[],
    gpxSegment: CalculatedTrack | GpxSegment,
    routeLayer: LayerGroup<any>,
    track: Track
) {
    if (options.showMarker) {
        if (lastTrack === null) {
            const startMarker = L.marker(trackPoints[0], {
                icon: startIcon,
                title: getLanguage() === 'de' ? `Start von ${gpxSegment.filename}` : `Start of ${gpxSegment.filename}`,
            });
            startMarker.addTo(routeLayer);
        }

        if (lastTrack !== null) {
            const lastTrackTime = lastTrack.points[lastTrack.points.length - 1].time;
            const nextTrackTime = track.points[0].time;
            const timeDifferenceInSeconds = getTimeDifferenceInSeconds(nextTrackTime, lastTrackTime);
            if (timeDifferenceInSeconds > 4 * 60) {
                const endMarker = L.marker(trackPoints[0], {
                    icon: breakIcon,
                    title: `${gpxSegment.filename} - ${(timeDifferenceInSeconds / 60).toFixed(0)} min Pause`,
                });
                endMarker.addTo(routeLayer);
            }
        }

        let lastPoint: Point | null = null;
        track.points.forEach((point) => {
            const lastTimeStamp = lastPoint?.time;
            if (lastTimeStamp) {
                const timeDifferenceInSeconds = getTimeDifferenceInSeconds(point.time, lastTimeStamp);
                if (timeDifferenceInSeconds > 4 * 60) {
                    const breakMarker = L.marker(toLatLng(point), {
                        icon: breakIcon,
                        title: `${gpxSegment.filename} - ${(timeDifferenceInSeconds / 60).toFixed(
                            0
                        )} min Pause\n um ${formatTimeOnly(lastTimeStamp, true)}`,
                    });
                    breakMarker.addTo(routeLayer);
                }
            }
            lastPoint = point;
        });
    }
}

function addTrackToMap(gpxSegment: CalculatedTrack | GpxSegment, routeLayer: LayerGroup, options: MapOptions) {
    const gpx = getGpx(gpxSegment);
    let lastTrack: Track | null = null;
    gpx.tracks.forEach((track, index) => {
        const trackPoints = track.points.map(toLatLng);
        const connection = L.polyline(trackPoints, {
            weight: options.weight ?? 8,
            color: options.color ?? getColorFromUuid(gpxSegment.id),
            opacity: options.opacity ?? 0.6,
        }).bindTooltip(gpxSegment.filename, {
            sticky: true,
        });
        const clickCallBack = options?.clickCallBack;
        if (clickCallBack) {
            connection.on('click', (event: LeafletMouseEvent) => {
                clickCallBack(gpxSegment, event);
            });
        }

        const mouseInCallBack = options?.mouseInCallBack;
        if (mouseInCallBack) {
            connection.on('mouseover', () => {
                mouseInCallBack(gpxSegment);
            });
        }

        const mouseOutCallBack = options?.mouseOutCallBack;
        if (mouseOutCallBack) {
            connection.on('mouseout', () => {
                mouseOutCallBack(gpxSegment);
            });
        }

        connection.addTo(routeLayer);
        if (options.onlyShowBreaks) {
            addStartAndBreakMarker(options, lastTrack, trackPoints, gpxSegment, routeLayer, track);
            if (index === gpx.tracks.length - 1) {
                const endMarker = L.marker(trackPoints.reverse()[0], {
                    icon: endIcon,
                    title: getLanguage() === 'de' ? `Ziel` : `Destination`,
                });
                endMarker.addTo(routeLayer);
            }
        } else {
            if (options.showMarker) {
                const startMarker = L.marker(trackPoints[0], {
                    icon: startIcon,
                    title: gpxSegment.filename,
                });
                startMarker.addTo(routeLayer);
                const endMarker = L.marker(trackPoints.reverse()[0], {
                    icon: endIcon,
                    title: gpxSegment.filename,
                });
                endMarker.addTo(routeLayer);
            }
        }
        lastTrack = track;
    });
}

// TODO-187: When the readableTracks is just a list of gpxs, it should not be so big, I hope, and then wie do not need instances of the SimpleGpx anymore... at least for displaying
export function addTracksToLayer(
    calculatedTracksLayer: React.MutableRefObject<LayerGroup | null>,
    calculatedTracks: CalculatedTrack[] | GpxSegment[] | DisplayTrack[],
    show: boolean,
    options: MapOptions
) {
    const current = calculatedTracksLayer.current;
    if (!calculatedTracksLayer || !current) {
        return;
    }
    current.clearLayers();
    if (show) {
        calculatedTracks.forEach((track) => {
            const enhancedOptions = isZipTrack(track)
                ? { ...options, color: track.color, opacity: options.highlightedId === track.id ? 1 : options.opacity }
                : options;
            addTrackToMap(track, current, enhancedOptions);
        });
    }
}
