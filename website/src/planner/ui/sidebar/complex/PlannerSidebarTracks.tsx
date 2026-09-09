import { useDispatch, useSelector } from 'react-redux';
import {
    getFilteredTrackCompositions,
    getTrackCompositionFilterTerm,
    getTrackCompositions,
    trackMergeActions,
} from '../../../store/trackMerge.reducer.ts';
import { Dropdown, Form, PageItem, Pagination } from 'react-bootstrap';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { TrackGapWarning } from '../../../tracks/TrackGapWarning.tsx';
import { getColor } from '../../../../utils/colorUtil.ts';
import { ColorBlob } from '../../../../utils/ColorBlob.tsx';
import { getSelectedTrackId, layoutActions } from '../../../store/layout.reducer.ts';
import { isDefined } from '../../../../utils/typeUtil.ts';
import { ReactSortable } from 'react-sortablejs';
import { TrackOverviewButton } from '../../../tracks/overview/TrackOverviewButton.tsx';
import { TrackDescriptionInfoButton } from './TrackDescriptionInfoButton.tsx';
import { TrackActionItems } from '../../../tracks/TrackActionItems.tsx';
import { TrackComposition } from '../../../store/types.ts';

interface TrackContextMenu {
    track: TrackComposition;
    x: number;
    y: number;
}

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getTrackCompositions);
    const filteredTracks = useSelector(getFilteredTrackCompositions);
    const selectedTrackId = useSelector(getSelectedTrackId);
    const dispatch = useDispatch();
    const intl = useIntl();
    const filterTerm = useSelector(getTrackCompositionFilterTerm);
    const setFilterTerm = (term: string) => dispatch(trackMergeActions.setTrackCompositionFilterTerm(term));
    const [contextMenu, setContextMenu] = useState<TrackContextMenu>();
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const setSelectedTrackId = (trackId: string | undefined) => dispatch(layoutActions.setSelectedTrackId(trackId));
    const selectedTrack = filteredTracks.find((track) => track.id === selectedTrackId);

    useEffect(() => {
        if (!selectedTrackId && filteredTracks.length > 0) {
            setSelectedTrackId(filteredTracks[0].id);
        }
    }, []);

    useEffect(() => {
        if (!contextMenu) {
            return;
        }

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!contextMenuRef.current?.contains(event.target as Node)) {
                setContextMenu(undefined);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setContextMenu(undefined);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [contextMenu]);

    useLayoutEffect(() => {
        if (!contextMenu || !contextMenuRef.current) {
            return;
        }

        const menu = contextMenuRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(contextMenu.x, window.innerWidth - menu.width - 8));
        const y = Math.max(0, Math.min(contextMenu.y, window.innerHeight - menu.height - 8));
        if (x !== contextMenu.x || y !== contextMenu.y) {
            setContextMenu({ ...contextMenu, x, y });
        }
    }, [contextMenu]);

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
            {trackCompositions.length > 0 && (
                <div className={'m-2'} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Form.Control
                        type="text"
                        placeholder="Filter tracks, separate term by ','"
                        value={filterTerm ?? ''}
                        onChange={(value) => setFilterTerm(value.target.value)}
                    />
                    <TrackOverviewButton />
                    <TrackDescriptionInfoButton />
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
                            data-testid={`track-tab-${track.id}`}
                            active={selectedTrackId === track.id}
                            onClick={() => setSelectedTrackId(track.id)}
                            onContextMenu={(event) => {
                                event.preventDefault();
                                setContextMenu({ track, x: event.clientX, y: event.clientY });
                            }}
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
            {contextMenu && (
                <Dropdown.Menu
                    ref={contextMenuRef}
                    show
                    data-testid="track-context-menu"
                    style={{
                        position: 'fixed',
                        left: contextMenu.x,
                        top: contextMenu.y,
                        zIndex: 1000001,
                    }}
                >
                    <TrackActionItems track={contextMenu.track} onAction={() => setContextMenu(undefined)} />
                </Dropdown.Menu>
            )}
            {selectedTrack && <PlannerSidebarTrackDetails track={selectedTrack} />}
        </div>
    );
};
