import { useDispatch, useSelector } from 'react-redux';
import { getFilteredTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';
import { PageItem, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getFilteredTrackCompositions);
    const dispatch = useDispatch();

    const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>();
    const selectedTrack = trackCompositions.find((track) => track.id === selectedTrackId);
    return (
        <div>
            <div>{'TODO: Maybe a filter here'}</div>
            <Pagination style={{ flexFlow: 'wrap' }}>
                {trackCompositions.map((track) => (
                    <PageItem
                        key={track.id}
                        active={selectedTrackId === track.id}
                        onClick={() => setSelectedTrackId(track.id)}
                    >
                        {track.name || 'N.N.'}
                    </PageItem>
                ))}
                <PageItem
                    key={'new track'}
                    onClick={() => {
                        const newTrackId = uuidv4();
                        dispatch(trackMergeActions.addTrackComposition({ id: newTrackId, segmentIds: [], name: '' }));
                        setSelectedTrackId(newTrackId);
                    }}
                >
                    + <FormattedMessage id={'msg.addNewTrack'} />
                </PageItem>
            </Pagination>
            {selectedTrack && <PlannerSidebarTrackDetails track={selectedTrack} />}
        </div>
    );
};
