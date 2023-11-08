import { useSelector } from 'react-redux';
import { SingleTrackStreetInfo } from './SingleTrackStreetInfo.tsx';
import { Pagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { StreetFilesDownloader } from '../../mapMatching/StreetFilesDownloader.tsx';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';
import { BlockedStreetInfo } from './BlockedStreetInfo.tsx';

export function StreetResolvedTracks() {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const [selectedTrackId, setSelectedTrackId] = useState<string>();

    const selectedInfo = trackStreetInfos.find(({ id }) => id === selectedTrackId);

    useEffect(() => {
        if (trackStreetInfos.length > 0) {
            setSelectedTrackId(trackStreetInfos[0].id);
        }
    }, [trackStreetInfos.length]);

    return (
        <>
            <div className={'m-2 p-2'} style={{ height: '100px', overflow: 'hidden' }}>
                <h3>Track Street Info</h3>
                <div className={'d-flex justify-content-between'}>
                    <div className={'mx-2'}>
                        <StreetFilesDownloader />
                    </div>
                    <Pagination></Pagination>
                    <Pagination>
                        <Pagination.Item
                            key={'streets'}
                            active={'streets' === selectedTrackId}
                            onClick={() => setSelectedTrackId('streets')}
                        >
                            Streets
                        </Pagination.Item>
                        {trackStreetInfos.map(({ id, name }) => (
                            <Pagination.Item
                                key={id}
                                active={id === selectedTrackId}
                                onClick={() => setSelectedTrackId(id)}
                            >
                                {name}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </div>
            <div style={{ height: '80%', overflow: 'auto' }}>
                <div>
                    <div>
                        {selectedInfo && <SingleTrackStreetInfo trackStreetInfo={selectedInfo} />}
                        {selectedTrackId === 'streets' && <BlockedStreetInfo />}
                        {!selectedInfo && selectedTrackId !== 'streets' && <div>No Track selected</div>}
                    </div>
                </div>
            </div>
        </>
    );
}
