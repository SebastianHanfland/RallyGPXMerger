import { useSelector } from 'react-redux';
import { PageItem, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { StreetInfoModal } from './StreetInfoModal.tsx';

export const PlannerSidebarStreetInfos = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);

    const [selectedTrackId, setSelectedTrackId] = useState<string>();
    const selectedTrack = trackStreetInfos.find((track) => track.id === selectedTrackId);
    const onHide = () => setSelectedTrackId(undefined);
    return (
        <div>
            <Pagination style={{ flexFlow: 'wrap' }}>
                {trackStreetInfos.map((track) => (
                    <PageItem
                        key={track.id}
                        active={selectedTrackId === track.id}
                        onClick={() => setSelectedTrackId(track.id)}
                    >
                        {track.name || 'N.N.'}
                    </PageItem>
                ))}
            </Pagination>
            {selectedTrack && <StreetInfoModal selectedTrack={selectedTrack} onHide={onHide} />}
        </div>
    );
};
