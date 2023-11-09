import { useSelector } from 'react-redux';
import { MutableRefObject, useEffect } from 'react';
import L, { LayerGroup } from 'leaflet';
import { getCurrenMapSource } from '../../../store/map.reducer.ts';
import { getBlockedStreetInfo } from '../../../mapMatching/getBlockedStreetInfo.ts';
import { getColorFromUuid } from '../../../utils/colorUtil.ts';
import { v4 as uuidv4 } from 'uuid';
import { BlockedStreetInfo } from '../../../mapMatching/types.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';

function createTooltip({ streetName, postCode, frontArrival, backPassage }: BlockedStreetInfo) {
    return `${streetName}, ${postCode} (blocked from ${formatTimeOnly(frontArrival)} until ${formatTimeOnly(
        backPassage
    )})`;
}

export function blockedStreetsDisplayHook(blockedStreetsLayer: MutableRefObject<LayerGroup | null>) {
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const mapSource = useSelector(getCurrenMapSource);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const current = blockedStreetsLayer.current;
        if (!blockedStreetsLayer || !current) {
            return;
        }
        current.clearLayers();
        console.log('Here it is');
        if (mapSource === 'blocked streets') {
            console.log('Here it is');
            blockedStreetInfos.forEach((blockedStreet) => {
                const streetPoints = [
                    { lat: blockedStreet.pointFrom.lat, lng: blockedStreet.pointFrom.lon },
                    { lat: blockedStreet.pointTo.lat, lng: blockedStreet.pointTo.lon },
                ];
                const connection = L.polyline(streetPoints, {
                    color: getColorFromUuid(uuidv4()),
                    weight: 4,
                }).bindTooltip(createTooltip(blockedStreet), {
                    sticky: true,
                });
                connection.addTo(current);
                // const startMarker = L.marker(trackPoints[0], {
                //     icon: startIcon,
                //     title: gpxSegment.filename,
                // });
                // startMarker.addTo(routeLayer);
                // const endMarker = L.marker(trackPoints.reverse()[0], {
                //     icon: endIcon,
                //     title: gpxSegment.filename,
                // });
                // endMarker.addTo(routeLayer);
            });
        }
    }, [blockedStreetInfos, blockedStreetInfos.length, mapSource]);
}
