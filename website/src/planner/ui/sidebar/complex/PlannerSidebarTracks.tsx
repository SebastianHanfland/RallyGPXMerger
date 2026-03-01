import { useDispatch, useSelector } from 'react-redux';
import {
    getFilteredTrackCompositions,
    getTrackCompositionFilterTerm,
    getTrackCompositions,
    trackMergeActions,
} from '../../../store/trackMerge.reducer.ts';
import { Form, PageItem, Pagination } from 'react-bootstrap';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { BlockTextDescription } from '../../../../utils/layout/BlockTextDescription.tsx';
import { TrackGapWarning } from '../../../tracks/TrackGapWarning.tsx';
import { getColor } from '../../../../utils/colorUtil.ts';
import { ColorBlob } from '../../../../utils/ColorBlob.tsx';
import { getSelectedTrackId, layoutActions } from '../../../store/layout.reducer.ts';
import { isDefined } from '../../../../utils/typeUtil.ts';
import { ReactSortable } from 'react-sortablejs';

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getTrackCompositions);
    const filteredTracks = useSelector(getFilteredTrackCompositions);
    const selectedTrackId = useSelector(getSelectedTrackId);
    const dispatch = useDispatch();
    const intl = useIntl();
    const filterTerm = useSelector(getTrackCompositionFilterTerm);
    const setFilterTerm = (term: string) => dispatch(trackMergeActions.setTrackCompositionFilterTerm(term));

    const setSelectedTrackId = (trackId: string | undefined) => dispatch(layoutActions.setSelectedTrackId(trackId));
    const selectedTrack = filteredTracks.find((track) => track.id === selectedTrackId);

    useEffect(() => {
        if (!selectedTrackId && filteredTracks.length > 0) {
            setSelectedTrackId(filteredTracks[0].id);
        }
    }, []);

    const setTrackIds = (items: { id: string }[]) => {
        const mappedIds = items.map((item) => item.id).join();
        if (mappedIds !== trackCompositions.map((track) => track.id).join()) {
            const newTracks = items.map((trackOption) =>
                trackCompositions.find((trackElement) => trackElement.id === trackOption.id)
            );
            dispatch(trackMergeActions.setTracks(newTracks.filter(isDefined)));
        }
    };

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
                <ReactSortable
                    style={{ flexFlow: 'wrap', display: 'flex' }}
                    delayOnTouchOnly={true}
                    list={trackCompositions.map((segment) => ({ id: segment.id }))}
                    setList={setTrackIds}
                >
                    {filteredTracks.map((track) => (
                        <PageItem
                            key={track.id}
                            active={selectedTrackId === track.id}
                            onClick={() => setSelectedTrackId(track.id)}
                        >
                            <ColorBlob color={getColor(track)} />
                            <TrackGapWarning trackId={track.id} />
                            {track.name || '---'}
                        </PageItem>
                    ))}
                </ReactSortable>
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
