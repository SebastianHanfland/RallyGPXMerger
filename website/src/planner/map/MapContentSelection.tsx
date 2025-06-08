import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    getShowBlockStreets,
    getShowCalculatedTracks,
    getShowConstructions,
    getShowGpxSegments,
    getShowMapMarker,
    getShowPointsOfInterest,
    mapActions,
} from '../store/map.reducer.ts';
import { getConstructionSegments } from '../store/gpxSegments.reducer.ts';
import { useIntl } from 'react-intl';
import { getFilteredTrackCompositions, getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { getFilteredGpxSegments, getParsedGpxSegments } from '../new-store/segmentData.redux.ts';

const mapContentStyle: CSSProperties = {
    position: 'fixed',
    width: '130px',
    height: '275px',
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
    const showPointsOfInterest = useSelector(getShowPointsOfInterest);
    const showConstructions = useSelector(getShowConstructions);
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
    return (
        <div style={mapContentStyle}>
            <ButtonGroup>
                <Form className={'d-flex flex-column'}>
                    <Button
                        id={'segments'}
                        title={'GPX Segments'}
                        variant={showGpxSegments ? 'info' : 'light'}
                        className={className}
                        onClick={() => dispatch(mapActions.setShowGpxSegments(!showGpxSegments))}
                    >
                        {sectionLabel}
                    </Button>
                    <Button
                        id={'tracks'}
                        title={'Calculated Tracks'}
                        variant={showCalculatedTracks ? 'info' : 'light'}
                        className={className}
                        onClick={() => dispatch(mapActions.setShowCalculatedTracks(!showCalculatedTracks))}
                    >
                        {trackLabel}
                    </Button>
                    <Button
                        id={'blocked streets'}
                        title={'Blocked Streets'}
                        variant={showBlockStreets ? 'info' : 'light'}
                        className={className}
                        onClick={() => dispatch(mapActions.setShowBlockStreets(!showBlockStreets))}
                    >
                        {intl.formatMessage({ id: 'msg.streets' })}
                    </Button>
                    <Button
                        id={'marker'}
                        title={showMapMarker ? 'Hide marker' : 'Show marker'}
                        variant={showMapMarker ? 'info' : 'light'}
                        className={className}
                        onClick={() => dispatch(mapActions.setShowMapMarker(!showMapMarker))}
                    >
                        {intl.formatMessage({ id: 'msg.marker' })}
                    </Button>
                    <Button
                        id={'points'}
                        title={showPointsOfInterest ? 'Hide Points' : 'Show Points'}
                        variant={showPointsOfInterest ? 'info' : 'light'}
                        className={className}
                        onClick={() => dispatch(mapActions.setShowPointsOfInterest(!showPointsOfInterest))}
                    >
                        {intl.formatMessage({ id: 'msg.points' })}
                    </Button>
                    {hasConstructions && (
                        <Button
                            id={'marker'}
                            title={'Constructions'}
                            variant={showConstructions ? 'info' : 'light'}
                            className={className}
                            onClick={() => dispatch(mapActions.setShowConstructions(!showConstructions))}
                        >
                            {intl.formatMessage({ id: 'msg.constructions' })}
                        </Button>
                    )}
                </Form>
            </ButtonGroup>
        </div>
    );
}
