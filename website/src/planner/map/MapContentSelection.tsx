import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    getShowBlockStreets,
    getShowBreakMarker,
    getShowCalculatedTracks,
    getShowConstructions,
    getShowEntryPointMarker,
    getShowGpxSegments,
    getShowMapMarker,
    getShowNodeMarker,
    getShowPointsOfInterest,
    mapActions,
} from '../store/map.reducer.ts';
import { useIntl } from 'react-intl';
import { getFilteredTrackCompositions, getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { getConstructionSegments, getFilteredGpxSegments, getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { ArrowRightIcon } from '../../utils/icons/ArrowRightIcon.tsx';
import { BreakIcon } from '../../utils/icons/BreakIcon.tsx';
import { NodeIcon } from '../../utils/icons/NodeIcon.tsx';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';

const mapContentStyle: CSSProperties = {
    position: 'fixed',
    width: '140px',
    height: '410px',
    borderRadius: '2px',
    left: 10,
    top: 130,
    zIndex: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    cursor: 'pointer',
};

export function MapContentSelection() {
    const intl = useIntl();
    const showMapMarker = useSelector(getShowMapMarker);
    const showBreakMarker = useSelector(getShowBreakMarker);
    const showNodeMarker = useSelector(getShowNodeMarker);
    const showPointsOfInterest = useSelector(getShowPointsOfInterest);
    const showConstructions = useSelector(getShowConstructions);
    const showEntryPointMarker = useSelector(getShowEntryPointMarker);
    const hasConstructions = (useSelector(getConstructionSegments) ?? [])?.length > 0;
    const showBlockStreets = useSelector(getShowBlockStreets);
    const showCalculatedTracks = useSelector(getShowCalculatedTracks);
    const showGpxSegments = useSelector(getShowGpxSegments);
    const dispatch = useDispatch();

    const numberOfFilteredSections = useSelector(getFilteredGpxSegments).length;
    const numberOfAllSections = useSelector(getParsedGpxSegments).length;
    const showSectionExtra = numberOfFilteredSections !== numberOfAllSections;
    const sectionLabel =
        intl.formatMessage({ id: 'msg.segments' }) +
        (showSectionExtra ? ` (${numberOfFilteredSections}/${numberOfAllSections})` : '');

    const numberOfFilteredTracks = useSelector(getFilteredTrackCompositions).length;
    const numberOfAllTracks = useSelector(getTrackCompositions).length;
    const showTrackExtra = numberOfFilteredTracks !== numberOfAllTracks;
    const trackLabel =
        intl.formatMessage({ id: 'msg.tracks' }) +
        (showTrackExtra ? ` (${numberOfFilteredTracks}/${numberOfAllTracks})` : '');

    const className = 'shadow my-1';
    const markerIconStyle = { width: '24px', height: '24px' };

    const primaryContent = showGpxSegments
        ? 'segments'
        : showCalculatedTracks
          ? 'tracks'
          : showBlockStreets
            ? 'streets'
            : undefined;

    const setPrimaryContent = (content: 'segments' | 'tracks' | 'streets') => {
        dispatch(mapActions.setPrimaryMapContent(primaryContent === content ? undefined : content));
    };

    return (
        <div style={mapContentStyle}>
            <Form className={'d-flex flex-column'}>
                <div className={'d-flex flex-column'}>
                    <Button
                        id={'segments'}
                        title={'GPX Segments'}
                        variant={primaryContent === 'segments' ? 'info' : 'light'}
                        className={className}
                        onClick={() => setPrimaryContent('segments')}
                    >
                        {sectionLabel}
                    </Button>
                    <Button
                        id={'tracks'}
                        title={'Calculated Tracks'}
                        variant={primaryContent === 'tracks' ? 'info' : 'light'}
                        className={className}
                        onClick={() => setPrimaryContent('tracks')}
                    >
                        {trackLabel}
                    </Button>
                    <Button
                        id={'blocked streets'}
                        title={'Blocked Streets'}
                        variant={primaryContent === 'streets' ? 'info' : 'light'}
                        className={className}
                        onClick={() => setPrimaryContent('streets')}
                    >
                        {intl.formatMessage({ id: 'msg.streets' })}
                    </Button>
                </div>
                <div className={'d-flex flex-column mt-2'}>
                    <Form.Check
                        id={'marker'}
                        type={'checkbox'}
                        checked={Boolean(showMapMarker)}
                        onChange={() => dispatch(mapActions.setShowMapMarker(!showMapMarker))}
                        label={
                            <>
                                <span aria-hidden={'true'}>
                                    <img src={'geo-alt-filled.svg'} alt={''} style={markerIconStyle} />
                                </span>
                                {intl.formatMessage({ id: 'msg.marker' })}
                            </>
                        }
                    />
                    <Form.Check
                        id={'nodes'}
                        type={'checkbox'}
                        checked={Boolean(showNodeMarker)}
                        onChange={() => dispatch(mapActions.setShowNodeMarker(!showNodeMarker))}
                        label={
                            <>
                                <span aria-hidden={'true'}>
                                    <NodeIcon size={24} />
                                </span>
                                {intl.formatMessage({ id: 'msg.nodes' })}
                            </>
                        }
                    />
                    <Form.Check
                        id={'break'}
                        type={'checkbox'}
                        checked={Boolean(showBreakMarker)}
                        onChange={() => dispatch(mapActions.setShowBreakMarker(!showBreakMarker))}
                        label={
                            <>
                                <span aria-hidden={'true'}>
                                    <BreakIcon />
                                </span>
                                {intl.formatMessage({ id: 'msg.breaks' })}
                            </>
                        }
                    />
                    <Form.Check
                        id={'entryPoints'}
                        type={'checkbox'}
                        checked={Boolean(showEntryPointMarker)}
                        onChange={() => dispatch(mapActions.setShowEntryPointMarker(!showEntryPointMarker))}
                        label={
                            <>
                                <span aria-hidden={'true'}>
                                    <ArrowRightIcon />
                                </span>
                                {intl.formatMessage({ id: 'msg.entryPoints' })}
                            </>
                        }
                    />
                    <Form.Check
                        id={'points'}
                        type={'checkbox'}
                        checked={Boolean(showPointsOfInterest)}
                        onChange={() => dispatch(mapActions.setShowPointsOfInterest(!showPointsOfInterest))}
                        label={
                            <>
                                <span aria-hidden={'true'}>
                                    <img src={'geo-alt-filled.svg'} alt={''} style={markerIconStyle} />
                                </span>
                                {intl.formatMessage({ id: 'msg.points' })}
                            </>
                        }
                    />
                    {hasConstructions && (
                        <Form.Check
                            id={'constructions'}
                            type={'checkbox'}
                            checked={Boolean(showConstructions)}
                            onChange={() => dispatch(mapActions.setShowConstructions(!showConstructions))}
                            label={
                                <>
                                    <span aria-hidden={'true'}>
                                        <WarningIcon />
                                    </span>
                                    {intl.formatMessage({ id: 'msg.constructions' })}
                                </>
                            }
                        />
                    )}
                </div>
            </Form>
        </div>
    );
}
