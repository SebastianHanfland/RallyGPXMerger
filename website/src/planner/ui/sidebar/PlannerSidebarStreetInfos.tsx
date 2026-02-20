import { useSelector } from 'react-redux';
import { PageItem, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { StreetInfoModal } from '../StreetInfoModal.tsx';
import { getTrackStreetInfos } from '../../logic/resolving/aggregate/calculateTrackStreetInfosWithBreaksAndNodes.ts';

export const PlannerSidebarStreetInfos = () => {
    const trackStreetInfos = useSelector(getTrackStreetInfos);

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
