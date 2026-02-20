import { useDispatch, useSelector } from 'react-redux';
import {
    getFilteredTrackCompositions,
    getTrackCompositionFilterTerm,
    getTrackCompositions,
    trackMergeActions,
} from '../store/trackMerge.reducer.ts';
import { Form, PageItem, Pagination } from 'react-bootstrap';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { BlockTextDescription } from '../layout/BlockTextDescription.tsx';
import { TrackGapWarning } from '../tracks/TrackGapWarning.tsx';
import { getColorFromUuid } from '../../utils/colorUtil.ts';

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getTrackCompositions);
    const filteredTracks = useSelector(getFilteredTrackCompositions);
    const dispatch = useDispatch();
    const intl = useIntl();
    const filterTerm = useSelector(getTrackCompositionFilterTerm);
    const setFilterTerm = (term: string) => dispatch(trackMergeActions.setTrackCompositionFilterTerm(term));

    const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>();
    const selectedTrack = filteredTracks.find((track) => track.id === selectedTrackId);

    useEffect(() => {
        if (filteredTracks.length > 0) {
            setSelectedTrackId(filteredTracks[0].id);
        }
    }, []);

    return (
        <div>
            <div className={'m-2'}>
                <BlockTextDescription messageId={'msg.description.tracks'} />
            </div>
            {trackCompositions.length > 0 && (
                <div className={'m-2'}>
                    <Form.Control
                        type="text"
                        placeholder="Filter tracks, separate term by ','"
                        value={filterTerm ?? ''}
                        onChange={(value) => setFilterTerm(value.target.value)}
                    />
                </div>
            )}
            <Pagination style={{ flexFlow: 'wrap' }} className={'m-2'}>
                {filteredTracks.map((track) => (
                    <PageItem
                        key={track.id}
                        active={selectedTrackId === track.id}
                        onClick={() => setSelectedTrackId(track.id)}
                    >
                        <span
                            className={'rounded-2 px-2 mx-1'}
                            style={{ backgroundColor: getColorFromUuid(track.id), color: getColorFromUuid(track.id) }}
                        ></span>
                        <TrackGapWarning trackId={track.id} />
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
                                segments: [],
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
