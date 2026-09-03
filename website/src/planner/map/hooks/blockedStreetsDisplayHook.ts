import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowBlockStreets } from '../../store/map.reducer.ts';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getColor } from '../../../utils/colorUtil.ts';
import { BlockedStreetInfo, BlockedStreetTrackUsage } from '../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { useIntl } from 'react-intl';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';

function createTooltip(
    info: BlockedStreetInfo,
    trackUsages: BlockedStreetTrackUsage[],
    labels: Record<string, string>
) {
    const usages = trackUsages
        .map(
            (usage) =>
                `${usage.trackName}: ${formatTimeOnly(usage.frontArrival)}–${formatTimeOnly(usage.backPassage)}; ${
                    labels.distance
                }: ${formatNumber(usage.distanceInKm ?? 0, 2)} km; ${labels.speed}: ${formatNumber(
                    usage.speed ?? 0,
                    1
                )} km/h`
        )
        .join('\n');
    return `${info.streetName ?? labels.unknown}, ${info.postCode ?? labels.unknown}\n${labels.blockage}: ${formatTimeOnly(
        info.frontArrival
    )}–${formatTimeOnly(info.backPassage)}\n${labels.tracks}:\n${usages}`;
}

function getCompositeColor(colors: string[]): string {
    const rgb = colors.map((color) => {
        const value = color.replace('#', '');
        return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
    });
    if (rgb.length === 0) return '#666666';
    return `#${[0, 1, 2]
        .map((channel) =>
            Math.round(rgb.reduce((sum, color) => sum + color[channel]!, 0) / rgb.length)
                .toString(16)
                .padStart(2, '0')
        )
        .join('')}`;
}

export function blockedStreetsDisplayHook(blockedStreetsLayer: RefObject<LayerGroup | null>) {
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const tracks = useSelector(getTrackCompositions);
    const showStreets = useSelector(getShowBlockStreets);
    const intl = useIntl();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = blockedStreetsLayer.current;
        if (!blockedStreetsLayer || !current) {
            return;
        }
        current.clearLayers();
        if (showStreets) {
            blockedStreetInfos.forEach((blockedStreet) => {
                const streetPoints = (blockedStreet.path ?? [blockedStreet.pointFrom, blockedStreet.pointTo]).map(
                    (point) => ({ lat: point.lat, lng: point.lon })
                );
                const trackUsages = blockedStreet.trackUsages ?? [];
                const colors = blockedStreet.tracksIds.map((trackId) => {
                    const track = tracks.find((item) => item.id === trackId);
                    return getColor(track ?? { id: trackId });
                });
                const connection = L.polyline(streetPoints, {
                    color: getCompositeColor(colors),
                    weight: 4,
                    dashArray: '5',
                }).bindTooltip(
                    createTooltip(blockedStreet, trackUsages, {
                        distance: intl.formatMessage({ id: 'msg.distance' }),
                        speed: intl.formatMessage({ id: 'msg.speed' }),
                        tracks: intl.formatMessage({ id: 'msg.tracks' }),
                        unknown: intl.formatMessage({ id: 'msg.unknown' }),
                        blockage: intl.formatMessage({ id: 'msg.blockage' }),
                    }),
                    {
                        sticky: true,
                    }
                );
                connection.addTo(current);
            });
        }
    }, [blockedStreetInfos, blockedStreetInfos.length, showStreets, tracks, intl]);
}
