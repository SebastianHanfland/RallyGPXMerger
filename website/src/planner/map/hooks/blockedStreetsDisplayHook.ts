import { useSelector } from 'react-redux';
import { RefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getShowBlockStreets } from '../../store/map.reducer.ts';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getColorFromString } from '../../../utils/colorUtil.ts';
import { BlockedStreetInfo, BlockedStreetTrackUsage } from '../../logic/resolving/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { useIntl } from 'react-intl';
import { formatNumber } from '../../../utils/numberUtil.ts';

function escapeTooltipText(value: string): string {
    return value.replace(
        /[&<>"']/g,
        (character) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[character]!
    );
}

export function createStreetTooltip(
    info: BlockedStreetInfo,
    trackUsages: BlockedStreetTrackUsage[],
    labels: Record<string, string>
) {
    const usages = trackUsages
        .map(
            (usage) =>
                `${escapeTooltipText(usage.trackName)}: ${formatTimeOnly(usage.frontArrival)}–${formatTimeOnly(
                    usage.backPassage
                )}; ${labels.distance}: ${formatNumber(usage.distanceInKm ?? 0, 2)} km; ${
                    labels.speed
                }: ${formatNumber(usage.speed ?? 0, 1)} km/h`
        )
        .join('<br>');
    return [
        `${escapeTooltipText(info.streetName ?? labels.unknown)}, ${escapeTooltipText(info.postCode ?? labels.unknown)}`,
        `${labels.blockage}: ${formatTimeOnly(info.frontArrival)}–${formatTimeOnly(info.backPassage)}`,
        `${labels.tracks}:`,
        usages,
    ].join('<br>');
}

export function blockedStreetsDisplayHook(blockedStreetsLayer: RefObject<LayerGroup | null>) {
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
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
                const connection = L.polyline(streetPoints, {
                    color: getColorFromString(blockedStreet.streetName ?? 'unknown'),
                    weight: 4,
                    dashArray: '5',
                }).bindTooltip(
                    createStreetTooltip(blockedStreet, trackUsages, {
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
                connection.on('mouseover', () => connection.setStyle({ weight: 10 }));
                connection.on('mouseout', () => connection.setStyle({ weight: 4 }));
                connection.addTo(current);
            });
        }
    }, [blockedStreetInfos, blockedStreetInfos.length, showStreets, intl]);
}
