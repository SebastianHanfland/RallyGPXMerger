import { useDispatch, useSelector } from 'react-redux';
import { getFilteredTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';
import { PageItem, Pagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getFilteredTrackCompositions);
    const dispatch = useDispatch();
    const intl = useIntl();

    const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>();
    const selectedTrack = trackCompositions.find((track) => track.id === selectedTrackId);

    useEffect(() => {
        if (trackCompositions.length > 0) {
            setSelectedTrackId(trackCompositions[0].id);
        }
    }, []);

    return (
        <div>
            <Pagination style={{ flexFlow: 'wrap' }} className={'m-2'}>
                {trackCompositions.map((track) => (
                    <PageItem
                        key={track.id}
                        active={selectedTrackId === track.id}
                        onClick={() => setSelectedTrackId(track.id)}
                    >
                        {track.name || '---'}
                    </PageItem>
                ))}
                <PageItem
                    key={'new track'}
                    onClick={() => {
                        const newTrackId = uuidv4();
                        dispatch(
                            trackMergeActions.addTrackComposition({
                                id: newTrackId,
                                segmentIds: [],
                                name: intl.formatMessage({ id: 'msg.nn' }),
                            })
                        );
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