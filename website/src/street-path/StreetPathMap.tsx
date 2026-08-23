import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IntlProvider, useIntl } from 'react-intl';
import { decodeStreetPath } from '../utils/streetPathUrl.ts';
import { getMapConfiguration } from '../common/map/mapConfig.ts';
import { getLanguage } from '../language.ts';
import { getMessages } from '../lang/getMessages.ts';

interface Props {
    encodedPath: string;
    streetName?: string;
}

function StreetPathMap({ encodedPath, streetName }: Props) {
    const intl = useIntl();
    const mapElement = useRef<HTMLDivElement>(null);
    const path = useMemo(() => decodeStreetPath(encodedPath), [encodedPath]);
    const title = streetName || intl.formatMessage({ id: 'msg.streetPath.title' });

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        if (!path || !mapElement.current) return;

        const { tileUrlTemplate, getOptions } = getMapConfiguration();
        const map = L.map(mapElement.current);
        L.tileLayer(tileUrlTemplate, getOptions()).addTo(map);
        L.control.scale({ position: 'topright', imperial: false, maxWidth: 200 }).addTo(map);
        const latLngs = path.map(({ lat, lon }) => L.latLng(lat, lon));

        if (latLngs.length === 1) {
            L.circleMarker(latLngs[0]!, { radius: 7, color: '#005fcc', fillOpacity: 1 }).addTo(map);
            map.setView(latLngs[0]!, 18);
        } else {
            const line = L.polyline(latLngs, { color: '#005fcc', weight: 6 }).addTo(map);
            map.fitBounds(line.getBounds(), { padding: [24, 24], maxZoom: 18 });
        }

        return () => {
            map.remove();
        };
    }, [path]);

    if (!path) {
        return (
            <main className="container py-5 text-center">
                <h1 className="fs-3">{intl.formatMessage({ id: 'msg.streetPath.invalid' })}</h1>
            </main>
        );
    }

    return (
        <main style={{ position: 'relative', height: '100vh', width: '100vw' }}>
            <div ref={mapElement} style={{ height: '100%', width: '100%', zIndex: 0 }} />
            {streetName && (
                <h1
                    className="fs-5 m-0 px-3 py-2 bg-white text-dark shadow rounded"
                    style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, maxWidth: 'calc(100vw - 24px)' }}
                >
                    {streetName}
                </h1>
            )}
        </main>
    );
}

export function StreetPathMapWrapper(props: Props) {
    const language = getLanguage();
    return (
        <IntlProvider locale={language} messages={getMessages(language)}>
            <StreetPathMap {...props} />
        </IntlProvider>
    );
}
