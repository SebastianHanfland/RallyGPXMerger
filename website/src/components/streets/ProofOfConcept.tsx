import { useSelector } from 'react-redux';
import { getTrackStreetInfo } from '../../mapMatching/getTrackStreetInfo.ts';
import { SingleTrackStreetInfo } from './SingleTrackStreetInfo.tsx';
import { Pagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { StreetFilesDownloader } from '../../mapMatching/StreetFilesDownloader.tsx';

export function ProofOfConcept() {
    const trackStreetInfos = useSelector(getTrackStreetInfo);
    const [selectedTrackId, setSelectedTrackId] = useState<string>();

    const selectedInfo = trackStreetInfos.find(({ id }) => id === selectedTrackId);

    useEffect(() => {
        if (trackStreetInfos.length > 0) {
            setSelectedTrackId(trackStreetInfos[0].id);
        }
    }, [trackStreetInfos.length]);

    return (
        <div>
            <h3>Track Street Info</h3>
            <StreetFilesDownloader />
            <Pagination>
                {trackStreetInfos.map(({ id, name }) => (
                    <Pagination.Item key={id} active={id === selectedTrackId} onClick={() => setSelectedTrackId(id)}>
                        {name}
                    </Pagination.Item>
                ))}
            </Pagination>
            <div>
                {selectedInfo ? <SingleTrackStreetInfo trackStreetInfo={selectedInfo} /> : <div>No Track selected</div>}
            </div>
        </div>
    );
}
